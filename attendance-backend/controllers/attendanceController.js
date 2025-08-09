const db = require('../db/db'); // your database connection

// Helper function to create 4-digit random codes
const generateRandomCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Faculty generates code
const generateCode = async (req, res) => {
  const facultyId = req.user.id; // from JWT
  const { class_id } = req.body;

  try {
    const code = generateRandomCode();

    const generatedAt = new Date();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes expiry

    console.log("Faculty ID:", facultyId);
    console.log("Class ID:", class_id);
    console.log("Generated At:", generatedAt);
    console.log("Expires At:", expiresAt);
    console.log("Code:", code);

    await db.query(
      'INSERT INTO attendance_codes (code, faculty_id, class_id, generated_at, expires_at) VALUES ($1, $2, $3, $4, $5)',
      [code, facultyId, class_id, generatedAt, expiresAt]
    );

    res.status(200).json({
      message: 'Code generated successfully',
      code,
      expires_in: '3 min',
    });
  } catch (err) {
    console.error('Error generating code:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Mark attendance
const markAttendance = async (req, res) => {
  const studentId = req.user.id;
  const { code } = req.body;

  console.log("User from token:", req.user);
  console.log("Student ID:", studentId);
  console.log("Code received from frontend:", code);
//await
  try {
    const result = await db.query(
      'SELECT * FROM attendance_codes WHERE code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    const { class_id, expires_at } = result.rows[0];

    console.log("Current time:", new Date());
    console.log("Expires at:", new Date(expires_at));
    console.log("Expired?", Date.now() > new Date(expires_at).getTime());

    if (Date.now() > new Date(expires_at).getTime()) {
      return res.status(400).json({ error: 'Code has expired' });
    }

    // Manual check to prevent duplicate
    const existingRecord = await db.query(
      'SELECT * FROM attendance_records WHERE student_id = $1 AND class_id = $2',
      [studentId, class_id]
    );

    if (existingRecord.rows.length > 0) {
      return res.status(400).json({ error: 'Attendance already marked for this class' });
    }

    // Insert attendance
    console.log("✔️ About to insert attendance for student:", studentId, "class:", class_id);

    await db.query(
      'INSERT INTO attendance_records (student_id, class_id) VALUES ($1, $2)',
      [studentId, class_id]
    );

    res.status(200).json({ message: 'Attendance marked successfully' });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Attendance already marked for this class' });
    }
    console.error('❌ Error marking attendance:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
};

//View attendance
const viewAttendance = async (req, res) => {

const facultyId = req.user.id; // from JWT, authenticated user

  const { class_id, date } = req.query;

  try {
    const result = await db.query(
     `
  SELECT ar.id, ar.student_id, ar.marked_at, ac.code, ac.class_id
  FROM attendance_records ar
  JOIN attendance_codes ac ON ar.code_id = ac.id
  WHERE ac.faculty_id = $1 AND ac.class_id = $2 AND DATE(ar.marked_at) = $3

`,
      [facultyId, class_id, date]
    );

    res.status(200).json({ attendance: result.rows });
  } catch (err) {
    console.error('Error viewing attendance:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  generateCode,
  markAttendance,
  viewAttendance
};
