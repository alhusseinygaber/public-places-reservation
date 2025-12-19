// backend/src/routes/payments.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');
const QRCode = require('qrcode');
const prisma = new PrismaClient();
const router = express.Router();

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

// POST /api/payments - Process a payment
router.post('/', [
    body('bookingId').isInt().withMessage('Booking ID must be an integer'),
    body('method').isIn(['meeza', 'e-wallet', 'bank']).withMessage('Invalid payment method'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive')
], validate, async (req, res) => {
    const { bookingId, method, amount } = req.body;

    // ... rest of handler
    const userId = req.user.userId;

    try {
        // Verify booking belongs to user
        const booking = await prisma.booking.findUnique({ where: { id: parseInt(bookingId) } });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (booking.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Check if already paid
        const existingPayment = await prisma.payment.findFirst({ where: { bookingId: parseInt(bookingId) } });
        if (existingPayment) {
            return res.status(400).json({ error: 'Booking already paid' });
        }

        // Mock payment processing (always success for now)
        const transactionId = crypto.randomUUID();

        const payment = await prisma.payment.create({
            data: {
                bookingId: parseInt(bookingId),
                method,
                amount: parseFloat(amount),
                status: 'Success',
                transactionId
            }
        });

        const qrPayload = JSON.stringify({
            bookingId: booking.id,
            userId: userId,
            valid: true
        });

        // Generate QR Code as Data URL
        const qrCodeData = await QRCode.toDataURL(qrPayload);

        await prisma.booking.update({
            where: { id: parseInt(bookingId) },
            data: { qrCodeData }
        });

        res.json({ success: true, payment, message: 'Payment successful' });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Payment processing failed' });
    }
});

module.exports = router;
