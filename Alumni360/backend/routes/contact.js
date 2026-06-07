const express = require('express');
const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a contact/partnership form
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, institution, role, message, partnershipType } = req.body;

    // Validate request
    if (!name || !email || !institution || !role) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide all required fields' 
      });
    }

    // In a real application, you would:
    // 1. Save this to a ContactRequests collection in MongoDB
    // 2. Send an email notification to the site admin (e.g. using Nodemailer)
    // 3. Send an auto-reply to the user

    console.log('New Contact Request received:');
    console.log(`From: ${name} (${email}) - ${role} at ${institution}`);
    console.log(`Type: ${partnershipType}`);
    console.log(`Message: ${message}`);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Contact request submitted successfully'
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while processing request' 
    });
  }
});

module.exports = router;
