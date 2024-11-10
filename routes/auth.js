// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2, auth0_id } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Create a new user
    const newUser = await User.create({
      email,
      password,
      securityQuestion1, 
      securityAnswer1, 
      securityQuestion2, 
      securityAnswer2,
      auth0_id: auth0_id || undefined // Only set if provided
    });

    
    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

   // Respond with the created user ID (_id)
    res.status(201).json({
      message: 'User created successfully',
      userId: newUser._id, // Return the userId in the response
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' }); // Use 404 for not found
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Respond with the token
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Check email route
router.post('/check-email', async (req, res) => {
  const { email } = req.body;

  try {
      // Check if the user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists.' });
      }
      res.status(200).json({ message: 'Email is available.' });
  } catch (error) {
      console.error('Error checking email:', error);
      res.status(500).json({ message: 'Error checking email', error: error.message });
  }
});

const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Only if sending emails
// // Forgot Password Route
// router.post('/forgot-password', async (req, res) => {
//   const { email } = req.body;

//   try {
//       // Check if the user exists
//       const user = await User.findOne({ email });
//       if (!user) {
//           return res.status(404).json({ message: 'User not found.' });
//       }

//       // Generate a reset token (you could also use a random string or UUID)
//       const resetToken = crypto.randomBytes(32).toString('hex');

//       // Optionally send the reset link via email
//       const resetLink = `${process.env.ORIGIN}/reset-password?token=${resetToken}`;
//       const message = `Please use the following link to reset your password: ${resetLink}`;

//       if (process.env.NODE_ENV !== 'test') {
//           const transporter = nodemailer.createTransport({
//               service: 'Gmail',
//               auth: {
//                   user: process.env.EMAIL_USER,
//                   pass: process.env.EMAIL_PASS,
//               },
//           });

//           await transporter.sendMail({
//               to: email,
//               subject: 'Password Reset',
//               text: message,
//           });
//       }

//       res.status(200).json({ message: 'Password reset link sent successfully' });
//   } catch (error) {
//       console.error('Error sending reset email:', error);
//       res.status(500).json({ message: 'Error sending reset email', error: error.message });
//   }
// });

  
module.exports = router;
