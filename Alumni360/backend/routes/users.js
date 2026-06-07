const express = require('express');
const { protect } = require('../middleware/auth');
const prisma = require('../db');

const router = express.Router();

router.get('/directory', protect, async (req, res) => {
  try {
    // Return all verified users for the directory
    const users = await prisma.user.findMany({
      where: { isVerified: true },
      select: {
        id: true, name: true, role: true, company: true, position: true, location: true, batch_year: true, industry: true, skills: true, bio: true, profileViews: true
      }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { bio, company, position, location, industry, skills } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { bio, company, position, location, industry, skills }
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create connection
router.post('/connect/:recipientId', protect, async (req, res) => {
  try {
    const connection = await prisma.connection.create({
      data: {
        requesterId: req.user.id,
        recipientId: parseInt(req.params.recipientId),
        status: 'pending'
      }
    });
    res.json({ success: true, data: connection });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
