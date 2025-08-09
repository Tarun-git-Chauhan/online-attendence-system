const express = require('express');
const router = express.Router();
const { generateCode, markAttendance, viewAttendance } = require('../controllers/attendanceController');
const { authenticateToken } = require('../controllers/authMiddleware');

// Routes
router.post('/generate', authenticateToken, generateCode);
router.post('/mark', authenticateToken, markAttendance);
router.get('/view', authenticateToken, viewAttendance);

module.exports = router;
