// controllers/attendanceController.js
import pool from '../config/db.js';
import { toDate, toTime } from '../utils/format.js';

/**
 * POST /api/attendance/submit
 * body: { userId, course, section, code }
 * Validates the active code for a class and inserts into attendance_records.
 * Also sets a late flag if the grace window has passed.
 */
export async function submitAttendance(req, res) {
  const { userId, course, section, code } = req.body || {};
  if (!userId || !course || !section || !code) {
    return res.status(400).json({ error: 'userId, course, section, code are required' });
  }

  try {
    // Find class
    const { rows: classRows } = await pool.query(
        'SELECT class_id FROM classes WHERE name = $1',
        [course]
    );
    if (classRows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }
    const classId = classRows[0].class_id;

    // Latest code for this class
    const { rows: codeRows } = await pool.query(
        `SELECT id, code, generated_at, expires_at
       FROM attendance_codes
       WHERE class_id=$1
       ORDER BY generated_at DESC
       LIMIT 1`,
        [classId]
    );
    if (codeRows.length === 0) {
      return res.status(400).json({ error: 'No active code found' });
    }

    const current = codeRows[0];

    if (String(current.code) !== String(code)) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    if (current.expires_at && new Date() > new Date(current.expires_at)) {
      return res.status(400).json({ error: 'Code expired' });
    }

    // Late calculation based on grace window after generated_at
    const graceMin = parseInt(process.env.LATE_GRACE_MINUTES || '5', 10);
    const lateAfter = new Date(new Date(current.generated_at).getTime() + graceMin * 60 * 1000);
    const now = new Date();
    const isLate = now > lateAfter;

    // Insert (or update the same session) per (student, class, code_id)
    const insertSql = `
      INSERT INTO attendance_records (student_id, code_id, class_id, is_late)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (student_id, class_id, code_id) DO UPDATE
        SET marked_at = CURRENT_TIMESTAMP,
            is_late  = EXCLUDED.is_late
      RETURNING id, marked_at, is_late
    `;
    const ins = await pool.query(insertSql, [userId, current.id, classId, isLate]);

    return res.json({
      ok: true,
      classId,
      codeId: current.id,
      markedAt: ins.rows[0]?.marked_at,
      isLate: ins.rows[0]?.is_late ?? isLate
    });
  } catch (e) {
    console.error('submitAttendance error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * GET /api/attendance/history?userId=..&course=..&section=..
 * Returns dated rows with Present/Late derived from attendance_records.is_late
 */
export async function history(req, res) {
  const { userId, course } = req.query || {};
  if (!userId || !course) {
    return res.status(400).json({ error: 'userId and course are required' });
  }

  try {
    const { rows: classRows } = await pool.query(
        'SELECT class_id FROM classes WHERE name=$1',
        [course]
    );
    if (classRows.length === 0) {
      return res.json({ history: [] });
    }
    const classId = classRows[0].class_id;

    const sql = `
      SELECT ar.marked_at, ar.is_late, ac.code
      FROM attendance_records ar
      JOIN attendance_codes ac ON ac.id = ar.code_id
      WHERE ar.student_id=$1 AND ar.class_id=$2
      ORDER BY ar.marked_at ASC
    `;
    const r = await pool.query(sql, [userId, classId]);

    const history = r.rows.map(row => ({
      date: toDate(row.marked_at),
      time: toTime(row.marked_at),
      status: row.is_late ? 'Late' : 'Present'
    }));

    return res.json({ history });
  } catch (e) {
    console.error('history error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * GET /api/attendance/summary?userId=..&course=..
 * Counts present vs late from attendance_records.
 * (Absent requires scheduled sessions; returns 0 for now.)
 */
export async function summary(req, res) {
  const { userId, course } = req.query || {};
  if (!userId || !course) {
    return res.status(400).json({ error: 'userId and course are required' });
  }

  try {
    const { rows: classRows } = await pool.query(
        'SELECT class_id FROM classes WHERE name=$1',
        [course]
    );
    if (classRows.length === 0) {
      return res.json({ present: 0, late: 0, absent: 0 });
    }
    const classId = classRows[0].class_id;

    const presentRow = await pool.query(
        `SELECT COUNT(*)::int AS c
       FROM attendance_records
       WHERE student_id=$1 AND class_id=$2 AND is_late = false`,
        [userId, classId]
    );
    const lateRow = await pool.query(
        `SELECT COUNT(*)::int AS c
       FROM attendance_records
       WHERE student_id=$1 AND class_id=$2 AND is_late = true`,
        [userId, classId]
    );

    const present = presentRow.rows[0]?.c ?? 0;
    const late = lateRow.rows[0]?.c ?? 0;
    const absent = 0; // needs session schedule to compute

    return res.json({ present, late, absent });
  } catch (e) {
    console.error('summary error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * POST /api/attendance/mark-late
 * body: { userId, classId, codeId }  // codeId = session to mark
 * Allows faculty to mark a student late for a given session.
 */
export async function markLate(req, res) {
  const { userId, classId, codeId, code } = req.body || {};
  if (!userId || !classId || (!codeId && !code)) {
    return res.status(400).json({ error: 'userId, classId, and codeId OR code are required' });
  }

  try {
    // Resolve codeId if only code was provided
    let resolvedCodeId = codeId;
    if (!resolvedCodeId) {
      const { rows } = await pool.query(
          `SELECT id FROM attendance_codes
         WHERE class_id=$1 AND code=$2
         ORDER BY generated_at DESC
         LIMIT 1`,
          [classId, String(code)]
      );
      if (!rows.length) return res.status(404).json({ error: 'Session code not found for this class' });
      resolvedCodeId = rows[0].id;
    }

    // Try update first
    const up = await pool.query(
        `UPDATE attendance_records
       SET is_late = true, marked_at = CURRENT_TIMESTAMP
       WHERE student_id=$1 AND class_id=$2 AND code_id=$3
       RETURNING id, marked_at, is_late`,
        [userId, classId, resolvedCodeId]
    );

    if (up.rowCount === 0) {
      // If no record, insert and mark late
      const ins = await pool.query(
          `INSERT INTO attendance_records (student_id, class_id, code_id, is_late)
         VALUES ($1,$2,$3,true)
         ON CONFLICT (student_id, class_id, code_id)
         DO UPDATE SET is_late=true, marked_at=CURRENT_TIMESTAMP
         RETURNING id, marked_at, is_late`,
          [userId, classId, resolvedCodeId]
      );
      return res.json({ ok: true, ...ins.rows[0] });
    }

    return res.json({ ok: true, ...up.rows[0] });
  } catch (e) {
    console.error('markLate error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}


/**
 * GET /api/attendance/reports/low-attendance?classId=1&threshold=0.8
 * Lists students attending less than {threshold} of sessions.
 * Each row in attendance_codes is treated as a "session".
 */
export async function lowAttendanceReport(req, res) {
  const classId = parseInt(req.query.classId, 10);
  const threshold = req.query.threshold ? Number(req.query.threshold) : 0.8;

  if (!classId) {
    return res.status(400).json({ error: 'classId is required' });
  }

  try {
    // total sessions = number of codes generated for the class
    const sessRow = await pool.query(
        'SELECT COUNT(*)::int AS total_sessions FROM attendance_codes WHERE class_id=$1',
        [classId]
    );
    const total = sessRow.rows[0]?.total_sessions || 0;
    if (total === 0) {
      return res.json({ totalSessions: 0, students: [] });
    }

    // attendance per student
    const rows = await pool.query(
        `
          SELECT u.user_id, u.full_name, COUNT(DISTINCT ar.code_id)::int AS attended
          FROM users u
                 JOIN student_classes sc ON sc.student_id = u.user_id
                 LEFT JOIN attendance_records ar
                           ON ar.student_id = u.user_id AND ar.class_id = sc.class_id
          WHERE sc.class_id = $1 AND u.role = 'student'
          GROUP BY u.user_id, u.full_name
          ORDER BY u.full_name
        `,
        [classId]
    );

    const students = rows.rows
        .map(r => {
          const attended = r.attended || 0;
          const pct = total ? Math.round((attended / total) * 100) : 0;
          return {
            userId: r.user_id,
            name: r.full_name,
            attended,
            total,
            percentage: pct
          };
        })
        .filter(s => s.percentage < Math.round(threshold * 100));

    return res.json({ totalSessions: total, threshold: Math.round(threshold * 100), students });
  } catch (e) {
    console.error('lowAttendanceReport error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
