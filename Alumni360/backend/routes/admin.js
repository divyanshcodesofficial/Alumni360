const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../db');

const router = express.Router();

// Middleware to protect admin routes
const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User is not an admin' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

// @route   GET /api/admin/analytics
// @desc    Get system analytics for admin dashboard
// @access  Private/Admin
router.get('/analytics', protectAdmin, async (req, res) => {
  try {
    const studentsRegistered = await prisma.user.count({ where: { role: 'student', isVerified: true } });
    const alumniRegistered = await prisma.user.count({ where: { role: 'alumni', isVerified: true } });
    const facultyRegistered = await prisma.user.count({ where: { role: 'faculty', isVerified: true } });
    
    // For demo purposes, we'll return some static and some dynamic data
    res.status(200).json({
      success: true,
      data: {
        collegesRegistered: 42,
        studentsRegistered: studentsRegistered || 2847,
        alumniRegistered: alumniRegistered || 8543,
        facultyRegistered: facultyRegistered || 312,
        averageEngagement: '78%',
        totalEvents: 156,
        activeUsers: 1247
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
