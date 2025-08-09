import dotenv from 'dotenv';
import pkg from 'pg';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') ? { rejectUnauthorized: false } : false
});

// optional: test connection on boot
pool.query('SELECT NOW()').then(r => {
  console.log('✅ DB connected at:', r.rows[0].now);
}).catch(err => {
  console.error('❌ DB connection error:', err.message);
});

export default pool;
