import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './src/routes/auth.js';
import attendanceRoutes from './src/routes/attendance.js';
import facultyRoutes from './src/routes/faculty.js';
import reportsRoutes from './src/routes/reports.js';

const app = express();
const PORT = process.env.PORT || 4000;

// --- CORS: allow your JetBrains local server (63342) ---
const ALLOWED_ORIGINS = [
  'http://localhost:63342',
  'http://127.0.0.1:63342'
];

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);              // allow Postman / curl (no origin)
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS: ' + origin));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false                                  // we’re not using cookies
}));

app.options('*', cors());                             // handle preflight quickly
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req,res) => res.json({ ok:true, service: 'attendance-backend-node' }));

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/reports', reportsRoutes);

// Fallback
app.use((req,res) => res.status(404).json({ error: 'Not found'}));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
