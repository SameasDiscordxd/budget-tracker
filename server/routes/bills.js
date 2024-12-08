const express = require('express');
const router = express.Router();
const { Bill, MainCategory, SubCategory } = require('../models/bill');

// Get all bills
router.get('/', async (req, res) => {
    try {
        const bills = await Bill.findAll({
            include: [
                { model: MainCategory },
                { model: SubCategory }
            ],
            order: [['dueDate', 'ASC']]
        });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bill by ID
router.get('/:id', async (req, res) => {
    try {
        const bill = await Bill.findByPk(req.params.id, {
            include: [MainCategory, SubCategory]
        });
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.json(bill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new bill
router.post('/', async (req, res) => {
    try {
        const newBill = await Bill.create(req.body);
        res.status(201).json(newBill);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update bill
router.put('/:id', async (req, res) => {
    try {
        const bill = await Bill.findByPk(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        await bill.update(req.body);
        res.json(bill);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete bill
router.delete('/:id', async (req, res) => {
    try {
        const bill = await Bill.findByPk(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        await bill.destroy();
        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;