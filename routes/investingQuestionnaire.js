// routes/companyInformation.js
const express = require('express');
const router = express.Router();
const InvestingQuestionnaire = require('../models/InvestingQuestionnaire');
const User = require('../models/User');

router.post('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const {
            investingQ1,
            investingQ2,
            investingQ2CashAmount,
            investingQ2BusinessDuration,
            investingQ2AverageCashPerYear,
            investingQ3,
            investingQ4,
            investingQ4CashBackDate,
            investingQ4CashBackDuration,
            investingQ5,
            investingQ6,
            investingQ7,
            investingQ8
        } = req.body;

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // If the user already has company information, update it
        let investingInfo;
        if (user.investingQuestionnaire) {
            investingInfo = await InvestingQuestionnaire.findByIdAndUpdate(
                user.investingQuestionnaire,
                {
                    investingQ1,
                    investingQ2,
                    investingQ2CashAmount,
                    investingQ2BusinessDuration,
                    investingQ2AverageCashPerYear,
                    investingQ3,
                    investingQ4,
                    investingQ4CashBackDate,
                    investingQ4CashBackDuration,
                    investingQ5,
                    investingQ6,
                    investingQ7,
                    investingQ8
                },
                { new: true }
            );
        } else {
            // Otherwise, create new company information
            investingInfo = new InvestingQuestionnaire({
                investingQ1,
                investingQ2,
                investingQ2CashAmount,
                investingQ2BusinessDuration,
                investingQ2AverageCashPerYear,
                investingQ3,
                investingQ4,
                investingQ4CashBackDate,
                investingQ4CashBackDuration,
                investingQ5,
                investingQ6,
                investingQ7,
                investingQ8
            });

            // Save the company information
            await investingInfo.save();

            // Link the company information to the user
            user.investingQuestionnaire = investingInfo._id;
            await user.save();
        }

        // Return the updated or newly created company information
        res.status(200).json(investingInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error saving investing information', error: error.message });
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
