import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import { authenticateUser, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Protected route for authenticated users
router.get('/profile', authenticateUser, (req, res) => {
  res.status(200).json({ message: 'Welcome to your profile!', user: req.user });
});

// Admin-only route
router.get('/admin', authenticateUser, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Admin dashboard access granted.' });
});

export default router;
