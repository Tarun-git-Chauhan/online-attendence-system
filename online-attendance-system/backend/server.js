import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './src/routes/auth.js';
import attendanceRoutes from './src/routes/attendance.js';
import facultyRoutes from './src/routes/faculty.js';

const app = express();
const PORT = process.env.PORT || 4000;
const corsOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req,res) => res.json({ ok:true, service: 'attendance-backend-node' }));

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/faculty', facultyRoutes);

// Fallback
app.use((req,res) => res.status(404).json({ error: 'Not found'}));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
