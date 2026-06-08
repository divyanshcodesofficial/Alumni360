const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const prisma = require('../db');

const router = express.Router();

// ─── User Directory ────────────────────────────────────────────────

router.get('/directory', protect, async (req, res) => {
  try {
    const { role, search, industry, skills } = req.query;
    const where = { isVerified: true };

    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (industry) {
      where.industry = { contains: industry, mode: 'insensitive' };
    }
    if (skills) {
      where.skills = { hasSome: skills.split(',').map(s => s.trim()) };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true, name: true, role: true, company: true, position: true,
        location: true, batch_year: true, industry: true, skills: true,
        bio: true, profileViews: true
      }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Profile ───────────────────────────────────────────────────────

router.put('/profile', protect, async (req, res) => {
  try {
    const { bio, company, position, location, industry, skills } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { bio, company, position, location, industry, skills }
    });
    // Update stored user in response
    res.json({
      success: true,
      data: {
        id: user.id, name: user.name, email: user.email, phone: user.phone,
        role: user.role, batch_year: user.batch_year,
        bio: user.bio, company: user.company, position: user.position,
        location: user.location, industry: user.industry, skills: user.skills,
        profileViews: user.profileViews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Connections ───────────────────────────────────────────────────

router.post('/connect/:recipientId', protect, async (req, res) => {
  try {
    const recipientId = parseInt(req.params.recipientId);
    if (recipientId === req.user.id) {
      return res.status(400).json({ success: false, error: 'Cannot connect with yourself' });
    }

    const connection = await prisma.connection.create({
      data: {
        requesterId: req.user.id,
        recipientId,
        status: 'pending'
      }
    });
    res.json({ success: true, data: connection });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, error: 'Connection request already exists' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/connections', protect, async (req, res) => {
  try {
    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          { requesterId: req.user.id },
          { recipientId: req.user.id }
        ],
        status: 'accepted'
      },
      include: {
        requester: { select: { id: true, name: true, role: true, company: true, position: true } },
        recipient: { select: { id: true, name: true, role: true, company: true, position: true } }
      }
    });
    res.json({ success: true, data: connections });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Mentorship ────────────────────────────────────────────────────

// Student sends a mentorship request to an alumni
router.post('/mentorship/request', protect, authorizeRoles('student'), async (req, res) => {
  try {
    const { alumniId, message } = req.body;

    // Verify the target is an alumni
    const alumni = await prisma.user.findUnique({ where: { id: parseInt(alumniId) } });
    if (!alumni || alumni.role !== 'alumni') {
      return res.status(400).json({ success: false, error: 'Target user is not an alumni' });
    }

    const mentorship = await prisma.mentorship.create({
      data: {
        studentId: req.user.id,
        alumniId: parseInt(alumniId),
        message: message || null,
        status: 'pending'
      }
    });

    // Create notification for the alumni
    await prisma.notification.create({
      data: {
        userId: parseInt(alumniId),
        title: 'New Mentorship Request',
        description: `${req.user.name} has requested you as a mentor.`
      }
    });

    res.json({ success: true, data: mentorship });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, error: 'Mentorship request already exists' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// Alumni responds to a mentorship request
router.put('/mentorship/:id/respond', protect, authorizeRoles('alumni'), async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "rejected"
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Status must be accepted or rejected' });
    }

    const mentorship = await prisma.mentorship.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!mentorship || mentorship.alumniId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to respond to this request' });
    }

    const updated = await prisma.mentorship.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });

    // Notify the student
    await prisma.notification.create({
      data: {
        userId: mentorship.studentId,
        title: `Mentorship Request ${status === 'accepted' ? 'Accepted' : 'Declined'}`,
        description: `${req.user.name} has ${status} your mentorship request.`
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get mentorship requests for the current user
router.get('/mentorship/requests', protect, async (req, res) => {
  try {
    let where;
    if (req.user.role === 'student') {
      where = { studentId: req.user.id };
    } else if (req.user.role === 'alumni') {
      where = { alumniId: req.user.id };
    } else {
      // Admin can see all
      where = {};
    }

    const mentorships = await prisma.mentorship.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, name: true, email: true, batch_year: true, skills: true, bio: true } },
        alumni: { select: { id: true, name: true, email: true, company: true, position: true, industry: true, skills: true } }
      }
    });

    res.json({ success: true, data: mentorships });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Events ────────────────────────────────────────────────────────

// Get all events
router.get('/events', protect, async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: {
        createdBy: { select: { id: true, name: true, role: true } }
      }
    });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create an event (alumni or admin only)
router.post('/events', protect, authorizeRoles('alumni', 'admin'), async (req, res) => {
  try {
    const { title, description, date, location, color } = req.body;
    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        date: new Date(date),
        location: location || null,
        color: color || 'bg-blue-500',
        createdById: req.user.id
      }
    });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete an event (only creator or admin)
router.delete('/events/:id', protect, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (event.createdById !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this event' });
    }

    await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Stats for individual user ─────────────────────────────────────

router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let stats = {};

    if (role === 'student') {
      const connections = await prisma.connection.count({
        where: { OR: [{ requesterId: userId }, { recipientId: userId }], status: 'accepted' }
      });
      const mentorshipsSent = await prisma.mentorship.count({ where: { studentId: userId } });
      const mentorshipsAccepted = await prisma.mentorship.count({ where: { studentId: userId, status: 'accepted' } });
      const profileViews = req.user.profileViews || 0;
      stats = { connections, mentorshipsSent, mentorshipsAccepted, profileViews };
    } else if (role === 'alumni') {
      const connections = await prisma.connection.count({
        where: { OR: [{ requesterId: userId }, { recipientId: userId }], status: 'accepted' }
      });
      const mentorshipsReceived = await prisma.mentorship.count({ where: { alumniId: userId } });
      const mentorshipsAccepted = await prisma.mentorship.count({ where: { alumniId: userId, status: 'accepted' } });
      const jobsPosted = await prisma.job.count({ where: { authorId: userId } });
      const eventsCreated = await prisma.event.count({ where: { createdById: userId } });
      const profileViews = req.user.profileViews || 0;
      stats = { connections, mentorshipsReceived, mentorshipsAccepted, jobsPosted, eventsCreated, profileViews };
    }

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
