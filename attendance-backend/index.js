const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL connection config
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'OnlineAttendanceSystem',
  password: '2312',
  port: 5432,
});

// Middleware
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Attendance Backend is Running!');
});

const bcrypt = require('bcrypt');

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        name: user.full_name,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
 
