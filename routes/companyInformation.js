// routes/companyInformation.js
const express = require('express');
const router = express.Router();
const CompanyInformation = require('../models/CompanyInformation');

// POST /api/companyInformation - Create new company information
router.post('/', async (req, res) => {
    try {
        const newCompanyInfo = new CompanyInformation(req.body);
        const savedCompanyInfo = await newCompanyInfo.save();
        res.status(201).json(savedCompanyInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating company information', error });
    }
});

// GET /api/companyInformation - Get all company information
router.get('/', async (req, res) => {
    try {
        const companyInfoList = await CompanyInformation.find();
        res.status(200).json(companyInfoList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company information', error });
    }
});

// GET /api/companyInformation/:id - Get company information by ID
router.get('/:id', async (req, res) => {
    try {
        const companyInfo = await CompanyInformation.findById(req.params.id);
        if (!companyInfo) {
            return res.status(404).json({ message: 'Company information not found' });
        }
        res.status(200).json(companyInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company information', error });
    }
});

// PUT /api/companyInformation/:id - Update company information by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedCompanyInfo = await CompanyInformation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCompanyInfo) {
            return res.status(404).json({ message: 'Company information not found' });
        }
        res.status(200).json(updatedCompanyInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating company information', error });
    }
});

// DELETE /api/companyInformation/:id - Delete company information by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedCompanyInfo = await CompanyInformation.findByIdAndDelete(req.params.id);
        if (!deletedCompanyInfo) {
            return res.status(404).json({ message: 'Company information not found' });
        }
        res.status(200).json({ message: 'Company information deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting company information', error });
    }
});

module.exports = router;
