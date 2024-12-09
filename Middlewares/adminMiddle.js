const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Access denied: Token missing', success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Not an admin', success: false });
    }

    req.adminId = decoded.id;
    next();
  } catch (err) {
    console.error('Error in adminAuth:', err.message);
    res.status(401).json({ message: 'Invalid or expired token', success: false });
  }
};

module.exports = adminAuth;
