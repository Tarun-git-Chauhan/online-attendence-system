/*
import pool from '../config/db.js';

function randomCode() {
  return String(Math.floor(1000 + Math.random()*9000));
}

/!**
 * POST /api/faculty/generate-code
 * body: { facultyId, classId }
 *!/
export async function generateCode(req, res) {
  const { facultyId, classId } = req.body || {};
  if (!facultyId || !classId) return res.status(400).json({ error: 'facultyId and classId are required' });
  try {
    const code = randomCode();
    const windowSec = parseInt(process.env.CODE_WINDOW_SECONDS || '180', 10);
    const r = await pool.query(
      `INSERT INTO attendance_codes (code, faculty_id, class_id, expires_at)
       VALUES ($1,$2,$3, CURRENT_TIMESTAMP + make_interval(secs => $4))
       RETURNING id, code, generated_at, expires_at`,
      [code, facultyId, classId, windowSec]
    );
    return res.json(r.rows[0]);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}
*/


import pool from '../config/db.js';

function randomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/**
 * POST /api/faculty/generate-code
 * body: { facultyId, classId }
 * Default expiry: 7 seconds (overridable by env CODE_WINDOW_SECONDS)
 */
export async function generateCode(req, res) {
  const { facultyId, classId } = req.body || {};
  if (!facultyId || !classId) return res.status(400).json({ error: 'facultyId and classId are required' });
  try {
    const windowSec = parseInt(process.env.CODE_WINDOW_SECONDS || '7', 10); // <-- 7s default
    const { rows } = await pool.query(
        `INSERT INTO attendance_codes (code, faculty_id, class_id, expires_at)
       VALUES (LPAD(TRUNC(RANDOM()*10000)::text, 4, '0'), $1, $2,
               CURRENT_TIMESTAMP + make_interval(secs => $3))
       RETURNING id, code, generated_at, expires_at`,
        [facultyId, classId, windowSec]
    );
    return res.json(rows[0]);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}
