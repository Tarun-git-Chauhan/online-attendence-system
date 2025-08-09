import { Router } from 'express';
import { getLowAttendance } from '../controllers/reportsController.js';

const router = Router();
router.get('/low-attendance', getLowAttendance);

export default router;
