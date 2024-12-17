// routes/companyInformation.js
const express = require('express');
const router = express.Router();
const CompanyInformation = require('../models/CompanyInformation');
const User = require('../models/User');

// POST /api/companyInformation/:userId - Create or Update company information for a user
router.post('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const {
            email,
            phoneNumber,
            companyName,
            companyAddressLine,
            city,
            state,
            zipcode,
            countryName,
            authPersonnel,
            companyBankAccounts,
            investmentAdvisors
        } = req.body;

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // If the user already has company information, update it
        let companyInfo;
        if (user.companyInformation) {
            companyInfo = await CompanyInformation.findByIdAndUpdate(
                user.companyInformation,
                {
                    email,
                    phoneNumber,
                    companyName,
                    companyAddressLine,
                    city,
                    state,
                    zipcode,
                    countryName,
                    authPersonnel,
                    companyBankAccounts,
                    investmentAdvisors
                },
                { new: true }
            );
        } else {
            // Otherwise, create new company information
            companyInfo = new CompanyInformation({
                email,
                phoneNumber,
                companyName,
                companyAddressLine,
                city,
                state,
                zipcode,
                countryName,
                authPersonnel,
                companyBankAccounts,
                investmentAdvisors
            });

            // Save the company information
            await companyInfo.save();

            // Link the company information to the user
            user.companyInformation = companyInfo._id;
            await user.save();
        }

        // Return the updated or newly created company information
        res.status(200).json(companyInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error saving company information', error: error.message });
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
