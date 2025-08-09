/*
import pool from '../config/db.js';
import { toDate, toTime } from '../utils/format.js';

/!**
 * POST /api/attendance/submit
 * body: { userId, course, section, code }
 * Validates active code for class and inserts attendance_records
 *!/
export async function submitAttendance(req, res) {
  const { userId, course, section, code } = req.body || {};
  if (!userId || !course || !section || !code) {
    return res.status(400).json({ error: 'userId, course, section, code are required' });
  }
  try {
    // Find class by course+section (here "classes.name" is course label; section not stored in schema, so we treat section as part of name if you use it that way)
    const { rows: classRows } = await pool.query('SELECT class_id FROM classes WHERE name = $1', [course]);
    if (classRows.length === 0) return res.status(404).json({ error: 'Class not found' });
    const classId = classRows[0].class_id;

    // Verify active code
    const { rows: codeRows } = await pool.query(
      'SELECT id, code, expires_at FROM attendance_codes WHERE class_id=$1 ORDER BY generated_at DESC LIMIT 1',
      [classId]
    );
    if (codeRows.length === 0) return res.status(400).json({ error: 'No active code found' });
    const current = codeRows[0];
    if (current.code !== String(code)) return res.status(400).json({ error: 'Invalid code' });
    if (current.expires_at && new Date() > new Date(current.expires_at)) {
      return res.status(400).json({ error: 'Code expired' });
    }

    // Upsert-like: unique (student_id,class_id) in attendance_records
    // Try insert; if conflict unique_attendance_per_class exists, mark as already
    const insertSql = `
      INSERT INTO attendance_records (student_id, code_id, class_id)
      VALUES ($1,$2,$3)
      ON CONFLICT (student_id, class_id) DO UPDATE
        SET code_id = EXCLUDED.code_id,
            marked_at = CURRENT_TIMESTAMP
      RETURNING id, marked_at
    `;
    const ins = await pool.query(insertSql, [userId, current.id, classId]);
    const markedAt = ins.rows[0].marked_at;
    return res.json({ ok: true, classId, codeId: current.id, markedAt });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}

/!**
 * GET /api/attendance/history?userId=..&course=..&section=..
 *!/
export async function history(req, res) {
  const { userId, course } = req.query || {};
  if (!userId || !course) return res.status(400).json({ error: 'userId and course are required' });
  try {
    const { rows: classRows } = await pool.query('SELECT class_id FROM classes WHERE name=$1', [course]);
    if (classRows.length === 0) return res.json({ history: [] });
    const classId = classRows[0].class_id;

    const sql = `
      SELECT ar.marked_at, ac.code
      FROM attendance_records ar
      JOIN attendance_codes ac ON ac.id = ar.code_id
      WHERE ar.student_id=$1 AND ar.class_id=$2
      ORDER BY ar.marked_at ASC
    `;
    const r = await pool.query(sql, [userId, classId]);
    const history = r.rows.map(row => ({
      date: toDate(row.marked_at),
      time: toTime(row.marked_at),
      status: 'Present' // you can compute Late if needed based on time window
    }));
    return res.json({ history });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}

/!**
 * GET didattendance/summary?userId=..&course=..&section=..
 * Computes simple counts from attendance_records for now.
 *!/
export async function summary(req, res) {
  const { userId, course } = req.query || {};
  if (!userId || !course) return res.status(400).json({ error: 'userId and course are required' });
  try {
    const { rows: classRows } = await pool.query('SELECT class_id FROM classes WHERE name=$1', [course]);
    if (classRows.length === 0) return res.json({ present: 0, absent: 0, late: 0 });
    const classId = classRows[0].class_id;

    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS present FROM attendance_records WHERE student_id=$1 AND class_id=$2',
      [userId, classId]
    );
    const present = rows[0]?.present || 0;
    // For demo, we treat late=0; you can extend schema or compute via marked_at threshold
    const late = 0;
    // Absent would normally require scheduled class dates; here we return 0
    const absent = 0;
    return res.json({ present, absent, late });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}
*/



import pool from '../config/db.js';
import { toDate, toTime } from '../utils/format.js';

/** Upsert to public.attendance, one row per user/class per calendar day */
async function upsertAttendance({ userId, classId, status, code = null, whenTs = new Date() }) {
  const existing = await pool.query(
      `SELECT id FROM attendance
     WHERE user_id=$1 AND class_id=$2 AND created_at::date=$3::date
     ORDER BY id DESC LIMIT 1`,
      [userId, classId, whenTs]
  );
  if (existing.rows.length) {
    await pool.query(
        `UPDATE attendance
         SET status=$1, code=COALESCE($2, code)
       WHERE id=$3`,
        [status, code, existing.rows[0].id]
    );
    return { id: existing.rows[0].id, updated: true };
  } else {
    const ins = await pool.query(
        `INSERT INTO attendance (user_id, class_id, code, status, created_at)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        [userId, classId, code, status, whenTs]
    );
    return { id: ins.rows[0].id, updated: false };
  }
}

/**
 * POST /api/attendance/submit
 * body: { userId, course, section, code }
 * - Accepts EXPIRED code: records status='late' instead of rejecting.
 * - Writes to attendance_records (your existing flow) AND attendance (with status).
 */
export async function submitAttendance(req, res) {
  const { userId, course, section, code } = req.body || {};
  if (!userId || !course || !section || !code) {
    return res.status(400).json({ error: 'userId, course, section, code are required' });
  }
  try {
    const { rows: classRows } = await pool.query('SELECT class_id FROM classes WHERE name = $1', [course]);
    if (classRows.length === 0) return res.status(404).json({ error: 'Class not found' });
    const classId = classRows[0].class_id;

    // fetch latest code for that class
    const { rows: codeRows } = await pool.query(
        'SELECT id, code, expires_at FROM attendance_codes WHERE class_id=$1 ORDER BY generated_at DESC LIMIT 1',
        [classId]
    );
    if (!codeRows.length) return res.status(400).json({ error: 'No active code found' });
    const current = codeRows[0];

    if (current.code !== String(code)) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    const now = new Date();
    const expired = current.expires_at && now > new Date(current.expires_at);
    const status = expired ? 'late' : 'present'; // <- late flag here

    // Keep your existing record (unique per student/class)
    const insertSql = `
      INSERT INTO attendance_records (student_id, code_id, class_id)
      VALUES ($1,$2,$3)
      ON CONFLICT (student_id, class_id) DO UPDATE
        SET code_id = EXCLUDED.code_id,
            marked_at = CURRENT_TIMESTAMP
      RETURNING id, marked_at
    `;
    const ins = await pool.query(insertSql, [userId, current.id, classId]);

    // Also store the status for the day in "attendance"
    await upsertAttendance({ userId, classId, status, code: String(code), whenTs: now });

    return res.json({ ok: true, classId, codeId: current.id, markedAt: ins.rows[0].marked_at, status });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Faculty manual late mark (optional)
 * POST /api/attendance/mark-late  body: { userId, course, section }
 */
export async function markLate(req, res) {
  const { userId, course, section } = req.body || {};
  if (!userId || !course || !section) {
    return res.status(400).json({ error: 'userId, course, section are required' });
  }
  try {
    const { rows: classRows } = await pool.query('SELECT class_id FROM classes WHERE name=$1', [course]);
    if (!classRows.length) return res.status(404).json({ error: 'Class not found' });
    const classId = classRows[0].class_id;

    const out = await upsertAttendance({ userId, classId, status: 'late', code: null, whenTs: new Date() });
    return res.json({ ok: true, classId, status: 'late', ...out });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * GET /api/attendance/history?userId=..&course=..&section=..
 * Now reads from "attendance" so we can show Present/Late per day.
 */
export async function history(req, res) {
  const { userId, course } = req.query || {};
  if (!userId || !course) return res.status(400).json({ error: 'userId and course are required' });
  try {
    const { rows: classRows } = await pool.query('SELECT class_id FROM classes WHERE name=$1', [course]);
    if (!classRows.length) return res.json({ history: [] });
    const classId = classRows[0].class_id;

    const r = await pool.query(
        `SELECT created_at, status FROM attendance
       WHERE user_id=$1 AND class_id=$2
       ORDER BY created_at ASC`,
        [userId, classId]
    );

    const history = r.rows.map(row => ({
      date: toDate(row.created_at),
      time: toTime(row.created_at),
      status: row.status === 'late' ? 'Late' : (row.status === 'absent' ? 'Absent' : 'Present')
    }));

    return res.json({ history });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * GET /api/attendance/summary?userId=..&course=..
 * Uses "attendance" to count present vs late (absent requires scheduled sessions).
 */
export async function summary(req, res) {
  const { userId, course } = req.query || {};
  if (!userId || !course) return res.status(400).json({ error: 'userId and course are required' });
  try {
    const { rows: classRows } = await pool.query('SELECT class_id FROM classes WHERE name=$1', [course]);
    if (!classRows.length) return res.json({ present: 0, late: 0, absent: 0 });
    const classId = classRows[0].class_id;

    const { rows } = await pool.query(
        `SELECT
         COUNT(*) FILTER (WHERE status='present')::int AS present,
         COUNT(*) FILTER (WHERE status='late')::int    AS late
       FROM attendance
       WHERE user_id=$1 AND class_id=$2`,
        [userId, classId]
    );
    const present = rows[0]?.present || 0;
    const late = rows[0]?.late || 0;
    // Absent needs class session schedule; return 0 for now.
    const absent = 0;
    return res.json({ present, late, absent });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}

