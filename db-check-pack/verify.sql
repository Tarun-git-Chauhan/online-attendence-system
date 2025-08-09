-- Basic sanity checks
SELECT 'users' AS table, COUNT(*) AS count FROM users
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'classes', COUNT(*) FROM classes
UNION ALL
SELECT 'attendance_codes', COUNT(*) FROM attendance_codes
UNION ALL
SELECT 'attendance_records', COUNT(*) FROM attendance_records
ORDER BY table;

-- Peek at some rows
SELECT user_id, full_name, email, role FROM users ORDER BY user_id LIMIT 10;
SELECT class_id, name, subject, faculty_id FROM classes ORDER BY class_id LIMIT 10;
SELECT id, code, class_id, expires_at FROM attendance_codes ORDER BY id DESC LIMIT 5;
SELECT id, student_id, code_id, class_id, marked_at FROM attendance_records ORDER BY marked_at DESC LIMIT 10;
