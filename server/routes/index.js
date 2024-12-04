// routes/index.js
const express = require('express');
const router = express.Router();

const billRoutes = require('./bills');
const categoryRoutes = require('./categories');

// Mount routes
router.use('/bills', billRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;