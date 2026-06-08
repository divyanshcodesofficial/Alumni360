const jwt = require('jsonwebtoken');
const prisma = require('../db');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }
      next();
    } catch (error) {
      res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

// Role-based authorization middleware
// Usage: authorizeRoles('admin', 'alumni')
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Role '${req.user?.role}' is not authorized to access this resource`
      });
    }
    next();
  };
};

// Valid roles constant
const VALID_ROLES = ['student', 'alumni', 'admin'];

module.exports = { protect, authorizeRoles, VALID_ROLES };
