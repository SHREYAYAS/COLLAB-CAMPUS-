const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model
const dotenv = require('dotenv');
const auth = require('../middleware/auth');

dotenv.config();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const username = req.body?.username?.trim();
    const emailRaw = req.body?.email;
    const password = req.body?.password;

    if (!username || !emailRaw || !password) {
      return res.status(400).json({ msg: 'Username, email, and password are required' });
    }

    const email = String(emailRaw).trim().toLowerCase();

    // 1. Check if user already exists
    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create new user instance (password will be hashed by pre-save hook)
    const user = new User({ username, email, password });
    await user.save();

    // 4. Create and return a JSON Web Token (JWT)
    const payload = { user: { id: user.id } };
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({ msg: 'Server misconfiguration' });
    }

    jwt.sign(
      payload,
      secret,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          console.error('jwt.sign error:', err.message);
          return res.status(500).json({ msg: 'Server error' });
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const emailRaw = req.body?.email;
    const password = req.body?.password;

    // Basic validation to avoid throwing 500s on bad input
    if (!emailRaw || typeof emailRaw !== 'string' || !password || typeof password !== 'string') {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const email = emailRaw.trim().toLowerCase();

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Compare the text password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. If they match, create and return a JWT
    const payload = { user: { id: user.id } };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({ msg: 'Server misconfiguration' });
    }

    jwt.sign(
      payload,
      secret,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          console.error('jwt.sign error:', err.message);
          return res.status(500).json({ msg: 'Server error' });
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

// Get current user profile
// @route   GET /api/auth/me
// @desc    Return current user (without password)
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});