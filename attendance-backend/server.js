const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import and use auth routes
const authRoutes = require('./routes/authRoutes');
console.log("✅ authRoutes loaded successfully");
app.use('/api/auth', authRoutes);

//for attendance routes
const attendanceRoutes = require('./routes/attendanceRoutes');
app.use('/api/attendance', attendanceRoutes);

//app.use(express.json());
// Test route
app.get('/', (req, res) => {
  res.send('Attendance system backend running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
