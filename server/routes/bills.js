// routes/bills.js
const express = require('express');
const router = express.Router();
const { Bill, MainCategory, SubCategory } = require('../models/bill');

// Get all bills
router.get('/', async (req, res) => {
    try {
        const bills = await Bill.findAll({
            include: [MainCategory, SubCategory]
        });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new bill
router.post('/', async (req, res) => {
    try {
        const newBill = await Bill.create(req.body);
        res.status(201).json(newBill);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;