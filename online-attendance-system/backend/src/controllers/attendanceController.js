import pool from '../config/db.js';
import { toDate, toTime } from '../utils/format.js';

/**
 * POST /api/attendance/submit
 * body: { userId, course, section, code }
 * Validates active code for class and inserts attendance_records
 */
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

/**
 * GET /api/attendance/history?userId=..&course=..&section=..
 */
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

/**
 * GET didattendance/summary?userId=..&course=..&section=..
 * Computes simple counts from attendance_records for now.
 */
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
