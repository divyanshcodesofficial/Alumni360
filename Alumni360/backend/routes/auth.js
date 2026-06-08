const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../db');
const { VALID_ROLES } = require('../middleware/auth');

const router = express.Router();

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Helper to check password
const matchPassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

// @route   POST /api/auth/signup/send-otp
// @desc    Send OTP for user registration
// @access  Public
router.post('/signup/send-otp', async (req, res) => {
  try {
    const { email, password, name, phone, role, batch_year, adminSecret } = req.body;

    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ success: false, error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });
    if (user && user.isVerified) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    if (role === 'admin' && adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ success: false, error: 'Invalid admin secret' });
    }

    // Generate a 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!user) {
      user = await prisma.user.create({
        data: {
          email, 
          password: hashedPassword, 
          name, 
          phone, 
          role, 
          batch_year: batch_year ? parseInt(batch_year) : null,
          otp, 
          otpExpire, 
          isVerified: false
        }
      });
    } else {
      user = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          name,
          phone,
          role,
          batch_year: batch_year ? parseInt(batch_year) : null,
          otp,
          otpExpire
        }
      });
    }

    // In a real app, send OTP via SMS (Twilio, SNS) here.
    // For development, we return it in the response
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      phone: user.phone,
      developmentOTP: otp
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/auth/signup/verify
// @desc    Verify OTP and complete registration
// @access  Public
router.post('/signup/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findFirst({ 
      where: {
        email,
        otp,
        otpExpire: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpire: null
      }
    });

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        batch_year: user.batch_year
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/auth/login/send-otp
// @desc    Send OTP for login
// @access  Public
router.post('/login/send-otp', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isVerified) {
      return res.status(401).json({ success: false, error: 'Invalid credentials or unverified user' });
    }

    // Block login for deprecated roles
    if (!VALID_ROLES.includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Your account role is no longer supported. Please contact an administrator.' });
    }

    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpire }
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      phone: user.phone,
      developmentOTP: otp
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/auth/login/verify
// @desc    Verify OTP for login
// @access  Public
router.post('/login/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findFirst({ 
      where: {
        email,
        otp,
        otpExpire: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpire: null }
    });

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        batch_year: user.batch_year
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin login routes
router.post('/admin/login/send-otp', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || user.role !== 'admin' || !user.isVerified) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpire }
    });

    res.status(200).json({ success: true, phone: user.phone, developmentOTP: otp });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/admin/login/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await prisma.user.findFirst({ 
      where: { 
        email, 
        otp, 
        otpExpire: { gt: new Date() }, 
        role: 'admin' 
      } 
    });
    
    if (!user) return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpire: null }
    });

    const token = generateToken(user.id);
    res.status(200).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
