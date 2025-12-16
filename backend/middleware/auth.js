const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Auth middleware that supports both x-auth-token and Authorization: Bearer <token>
module.exports = function (req, res, next) {
  let token = req.header('x-auth-token');

  // If not provided via x-auth-token, try Authorization: Bearer <token>
  if (!token) {
    const authHeader = req.header('authorization');
    if (authHeader && typeof authHeader === 'string') {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        token = parts[1];
      }
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};