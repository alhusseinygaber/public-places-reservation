// backend/src/routes/bookings.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const prisma = new PrismaClient();
const router = express.Router();

// Middleware to protect all routes
router.use(authenticateToken);

const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// POST /api/bookings - create a new booking
router.post('/', [
    body('venueId').isInt().withMessage('Venue ID must be an integer'),
    body('date').isISO8601().toDate().withMessage('Invalid date format'),
    body('timeSlot').notEmpty().withMessage('Time slot required'),
    body('tickets').isInt({ min: 1 }).withMessage('At least 1 ticket required')
], validate, async (req, res) => {
    const { venueId, date, timeSlot, tickets } = req.body;
    const userId = req.user.userId;
    try {
        const venue = await prisma.venue.findUnique({ where: { id: parseInt(venueId) } });
        if (!venue) return res.status(404).json({ error: 'Venue not found' });
        const totalPrice = venue.price * tickets;
        const booking = await prisma.booking.create({
            data: {
                userId,
                venueId: parseInt(venueId),
                date: new Date(date),
                timeSlot,
                tickets: parseInt(tickets),
                totalPrice,
                status: 'Active',
            },
        });
        res.json(booking);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/bookings/history - list user's bookings
router.get('/history', async (req, res) => {
    const userId = req.user.userId;
    try {
        const bookings = await prisma.booking.findMany({ where: { userId } });
        res.json(bookings);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/bookings/:id - get single booking
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(id) },
            include: { venue: true }
        });
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if (booking.userId !== userId) return res.status(403).json({ error: 'Not authorized' });
        res.json(booking);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/bookings/:id/cancel - cancel a booking
router.put('/:id/cancel', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
        const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } });
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if (booking.userId !== userId) return res.status(403).json({ error: 'Not authorized' });
        const updated = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: { status: 'Cancelled' },
        });
        res.json(updated);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
