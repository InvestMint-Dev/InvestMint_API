// routes/companyInformation.js
const express = require('express');
const router = express.Router();
const CompanyInformation = require('../models/CompanyInformation');
const User = require('../models/User');

// POST /api/companyInformation/:userId - Create or Update company information for a user
router.post('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create or update the company information
        let companyInfo;
        if (user.companyInformation) {
            // Update existing company information
            companyInfo = await CompanyInformation.findByIdAndUpdate(user.companyInformation, req.body, { new: true });
        } else {
            // Create new company information
            companyInfo = new CompanyInformation(req.body);
            await companyInfo.save();

            // Link the company information to the user
            user.companyInformation = companyInfo._id;
            await user.save();
        }

        res.status(200).json({ message: 'Company information saved', companyInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error saving company information', error });
    }
});

// GET /api/companyInformation/:userId - Get company information for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user
        const user = await User.findById(userId).populate('companyInformation');
        if (!user || !user.companyInformation) {
            return res.status(404).json({ message: 'Company information not found' });
        }

        res.status(200).json(user.companyInformation);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company information', error });
    }
});

module.exports = router;
