const express = require('express');
const prisma = require('../db');
const { protect, authorizeRoles, VALID_ROLES } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect);
router.use(authorizeRoles('admin'));

// @route   GET /api/admin/analytics
// @desc    Get real platform analytics
// @access  Private/Admin
router.get('/analytics', async (req, res) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'student', isVerified: true } });
    const totalAlumni = await prisma.user.count({ where: { role: 'alumni', isVerified: true } });
    const totalAdmins = await prisma.user.count({ where: { role: 'admin', isVerified: true } });
    const totalUsers = totalStudents + totalAlumni + totalAdmins;
    const totalPosts = await prisma.post.count();
    const totalJobs = await prisma.job.count();
    const totalEvents = await prisma.event.count();
    const totalConnections = await prisma.connection.count({ where: { status: 'accepted' } });
    const pendingMentorships = await prisma.mentorship.count({ where: { status: 'pending' } });
    const activeMentorships = await prisma.mentorship.count({ where: { status: 'accepted' } });
    const pendingJobs = await prisma.job.count({ where: { approved: false } });

    // Recent signups (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSignups = await prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo }, isVerified: true }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalAlumni,
        totalAdmins,
        totalPosts,
        totalJobs,
        totalEvents,
        totalConnections,
        pendingMentorships,
        activeMentorships,
        pendingJobs,
        recentSignups
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filtering
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isVerified: true };
    if (role && VALID_ROLES.includes(role)) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, phone: true, role: true,
          company: true, position: true, location: true, industry: true,
          batch_year: true, skills: true, bio: true, profileViews: true,
          createdAt: true, isVerified: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update a user's role
// @access  Private/Admin
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ success: false, error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
    }

    // Delete related data first
    await prisma.notification.deleteMany({ where: { userId } });
    await prisma.comment.deleteMany({ where: { authorId: userId } });
    await prisma.post.deleteMany({ where: { authorId: userId } });
    await prisma.job.deleteMany({ where: { authorId: userId } });
    await prisma.connection.deleteMany({ where: { OR: [{ requesterId: userId }, { recipientId: userId }] } });
    await prisma.mentorship.deleteMany({ where: { OR: [{ studentId: userId }, { alumniId: userId }] } });
    await prisma.event.updateMany({ where: { createdById: userId }, data: { createdById: null } });

    await prisma.user.delete({ where: { id: userId } });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/admin/events
// @desc    Get all events
// @access  Private/Admin
router.get('/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' },
      include: {
        createdBy: { select: { id: true, name: true, role: true } }
      }
    });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   DELETE /api/admin/events/:id
// @desc    Delete an event
// @access  Private/Admin
router.delete('/events/:id', async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/admin/jobs
// @desc    Get all jobs for moderation
// @access  Private/Admin
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, role: true } }
      }
    });
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   PUT /api/admin/jobs/:id/approve
// @desc    Approve or reject a job posting
// @access  Private/Admin
router.put('/jobs/:id/approve', async (req, res) => {
  try {
    const { approved } = req.body;
    const job = await prisma.job.update({
      where: { id: parseInt(req.params.id) },
      data: { approved: !!approved }
    });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   DELETE /api/admin/jobs/:id
// @desc    Delete a job posting
// @access  Private/Admin
router.delete('/jobs/:id', async (req, res) => {
  try {
    await prisma.job.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/admin/mentorships
// @desc    Get all mentorships
// @access  Private/Admin
router.get('/mentorships', async (req, res) => {
  try {
    const mentorships = await prisma.mentorship.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, name: true, email: true } },
        alumni: { select: { id: true, name: true, email: true } }
      }
    });
    res.json({ success: true, data: mentorships });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
