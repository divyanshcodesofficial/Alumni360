const express = require('express');
const { protect } = require('../middleware/auth');
const prisma = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, role: true, company: true, institution: true }
        }
      }
    });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { title, company, location, type, experience, salary, description, requirements, benefits, remote, urgent } = req.body;
    const job = await prisma.job.create({
      data: {
        title, company, location, type, experience, salary, description, remote, urgent,
        requirements: requirements || [],
        benefits: benefits || [],
        authorId: req.user.id
      },
      include: { author: { select: { id: true, name: true, role: true, company: true, institution: true } } }
    });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
