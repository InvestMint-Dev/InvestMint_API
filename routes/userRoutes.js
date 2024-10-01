const express = require('express');
const Entry = require('../models/User');
const router = express.Router();

// Get all entries
router.get('/', async (req, res) => {
    try {
        const entries = await Entry.find();
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new entry
router.post('/', async (req, res) => {
    const { title, body } = req.body;
    const newEntry = new Entry({ title, body });

    try {
        const savedEntry = await newEntry.save();
        res.json(savedEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an entry
router.put('/:id', async (req, res) => {
    try {
        const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an entry
router.delete('/:id', async (req, res) => {
    try {
        await Entry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Entry deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
