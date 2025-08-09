import pool from '../config/db.js';

/**
 * GET /api/reports/low-attendance?classId=1&from=2025-08-01&to=2025-08-31&threshold=80
 * Attendance % = (present + late) / total_sessions * 100
 * total_sessions = count of DISTINCT attendance days for this class in range
 */
export async function getLowAttendance(req, res) {
    try {
        const classId = Number(req.query.classId);
        if (!classId) return res.status(400).json({ error: 'classId is required' });

        const from = req.query.from || null;
        const to = req.query.to || null;
        const threshold = req.query.threshold ? Number(req.query.threshold) : 80;

        // how many sessions exist in that window for this class
        const totalQ = await pool.query(
            `SELECT COUNT(DISTINCT created_at::date) AS cnt
         FROM attendance
        WHERE class_id=$1
          AND ($2::date IS NULL OR created_at::date >= $2::date)
          AND ($3::date IS NULL OR created_at::date <= $3::date)`,
            [classId, from, to]
        );
        const totalSessions = Number(totalQ.rows[0].cnt);
        if (totalSessions === 0) return res.json({ classId, totalSessions: 0, threshold, students: [] });

        // enrolled students
        const studentsQ = await pool.query(
            `SELECT u.user_id, u.full_name, u.email
         FROM student_classes sc
         JOIN users u ON u.user_id = sc.student_id
        WHERE sc.class_id=$1
        ORDER BY u.full_name NULLS LAST, u.user_id`,
            [classId]
        );

        // how many days each student attended (present or late)
        const marksQ = await pool.query(
            `SELECT user_id, COUNT(DISTINCT created_at::date) FILTER (WHERE status IN ('present','late')) AS attended
         FROM attendance
        WHERE class_id=$1
          AND ($2::date IS NULL OR created_at::date >= $2::date)
          AND ($3::date IS NULL OR created_at::date <= $3::date)
        GROUP BY user_id`,
            [classId, from, to]
        );
        const attendedMap = new Map(marksQ.rows.map(r => [Number(r.user_id), Number(r.attended)]));

        const students = studentsQ.rows.map(s => {
            const attended = attendedMap.get(Number(s.user_id)) || 0;
            const percent = totalSessions ? +( (attended / totalSessions) * 100 ).toFixed(2) : 0;
            return {
                userId: Number(s.user_id),
                name: s.full_name || 'Student',
                email: s.email,
                attended,
                totalSessions,
                percent
            };
        }).filter(x => x.percent < threshold);

        res.json({ classId, totalSessions, threshold, students });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
}
