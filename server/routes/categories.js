// routes/categories.js
const express = require('express');
const router = express.Router();
const { MainCategory, SubCategory } = require('../models/bill');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await MainCategory.findAll({
            include: SubCategory
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new subcategory
router.post('/sub', async (req, res) => {
    try {
        const newSubCategory = await SubCategory.create(req.body);
        res.status(201).json(newSubCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;