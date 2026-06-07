const express = require('express');
const { protect } = require('../middleware/auth');
const prisma = require('../db');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, role: true, company: true, institution: true }
        },
        comments: {
          include: { author: { select: { id: true, name: true, role: true } } }
        }
      }
    });
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create post
router.post('/', protect, async (req, res) => {
  try {
    const { content, image, video } = req.body;
    const post = await prisma.post.create({
      data: {
        content, image, video,
        authorId: req.user.id
      },
      include: {
        author: { select: { id: true, name: true, role: true, company: true, institution: true } },
        comments: true
      }
    });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Like post
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: { likes: { increment: 1 } }
    });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Comment on post
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(req.params.id),
        authorId: req.user.id
      },
      include: { author: { select: { id: true, name: true, role: true } } }
    });
    res.json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
