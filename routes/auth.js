// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = req.body;

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
      securityAnswer2
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

  
module.exports = router;
