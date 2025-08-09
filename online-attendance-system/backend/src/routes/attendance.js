import { Router } from 'express';
import { submitAttendance, history, summary } from '../controllers/attendanceController.js';
// import { authRequired } from '../middleware/auth.js'; // optionally enable

const router = Router();
router.post('/submit', /*authRequired,*/ submitAttendance);
router.get('/history', /*authRequired,*/ history);
router.get('/summary', /*authRequired,*/ summary);
router.post('/mark-late', /*authRequired,*/ markLate);

export default router;
