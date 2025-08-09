import { Router } from 'express';
import { generateCode } from '../controllers/facultyController.js';
// import { authRequired } from '../middleware/auth.js';

const router = Router();
router.post('/generate-code', /*authRequired,*/ generateCode);

export default router;
