// in: backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Get token from the header
  const token = req.header('x-auth-token');

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Verify token
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');

    // Add the user payload (e.g., { id: 1, username: 'test' })
    // to the request object so our routes can use it
    req.user = decoded.user;

    next(); // Move on to the next function (the route handler)
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};