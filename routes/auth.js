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

const transporter = nodemailer.createTransport({
  service: 'gmail',  // Changed this from custom host/port
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS  // This needs to be an App Password, not your regular password
  }
});
// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Save the hashed token to the user document
      user.passwordResetToken = hashedToken;
      user.passwordResetExpires = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();

      // Create the reset URL
      const resetUrl = `${process.env.ORIGIN}/reset-password?token=${resetToken}`;

      // Email template
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'InvestMint Password Reset',
          html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #333;">Password Reset Request</h2>
                  <p>You requested a password reset for your InvestMint account. Click the button below to reset your password:</p>
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
                  </div>
                  <p>This link will expire in 1 hour.</p>
                  <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                  <hr style="border: 1px solid #eee; margin: 20px 0;">
                  <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
              </div>
          `
      };

      try {
          // Verify transporter
          await transporter.verify();
          
          // Send email
          await transporter.sendMail(mailOptions);
          
          res.status(200).json({ 
              message: 'Password reset instructions sent to your email.',
              // Don't send the token in the response for security
              expires: user.passwordResetExpires 
          });
          
      } catch (emailError) {
          // If email fails, revert the token save
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          await user.save();
          
          console.error('Email error:', emailError);
          throw new Error('Failed to send password reset email');
      }

  } catch (error) {
      console.error('Error in forgot password:', error);
      res.status(500).json({ 
          message: 'Error processing password reset request',
          error: error.message 
      });
  }
});

// // Add Reset Password Route
// router.post('/reset-password', async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//       // Hash the token from the request
//       const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//       // Find user with valid token and not expired
//       const user = await User.findOne({
//           passwordResetToken: hashedToken,
//           passwordResetExpires: { $gt: Date.now() }
//       });

//       if (!user) {
//           return res.status(400).json({ 
//               message: 'Password reset token is invalid or has expired' 
//           });
//       }

//       // Hash the new password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(newPassword, salt);

//       // Update user password and clear reset token fields
//       user.password = hashedPassword;
//       user.passwordResetToken = undefined;
//       user.passwordResetExpires = undefined;
//       await user.save();

//       res.status(200).json({ message: 'Password has been reset successfully' });

//   } catch (error) {
//       console.error('Error in reset password:', error);
//       res.status(500).json({ 
//           message: 'Error resetting password',
//           error: error.message 
//       });
//   }
// });

module.exports = router;