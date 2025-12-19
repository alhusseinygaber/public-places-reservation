// backend/src/routes/venues.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// GET /api/venues - list all venues with optional filters
router.get('/', async (req, res) => {
    const { province, type, minPrice, maxPrice, search } = req.query;
    const where = {};
    if (province) where.province = province;
    if (type) where.type = type;
    if (search) where.name = { contains: search };
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice);
        if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    try {
        const venues = await prisma.venue.findMany({ where });
        res.json(venues);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/venues/:id - get venue details
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const venue = await prisma.venue.findUnique({ where: { id: parseInt(id) } });
        if (!venue) return res.status(404).json({ error: 'Venue not found' });
        res.json(venue);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
