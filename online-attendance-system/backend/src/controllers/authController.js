import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
  const { email, password, role } = req.body || {};
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'email, password, role are required' });
  }
  try {
    const { rows } = await pool.query(
      'SELECT user_id, full_name, email, password_hash, role FROM users WHERE email=$1',
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    if (role && role !== user.role) return res.status(401).json({ error: 'Role mismatch' });

    const token = jwt.sign({ id: user.user_id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({
      token,
      user: { id: user.user_id, name: user.full_name, email: user.email, role: user.role }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}
