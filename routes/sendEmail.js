const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Changed this from custom host/port
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  // This needs to be an App Password, not your regular password
    }
});
// POST /api/sendEmail endpoint
router.post('/', async (req, res) => {
    const { email, title, message } = req.body;

    // Validate request fields
    if (!email || !title || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'administrator@investmintapp.com',
        subject: `New Contact Us Message: ${title}`,
        text: `Message from ${email}:\n\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
});

module.exports = router;
