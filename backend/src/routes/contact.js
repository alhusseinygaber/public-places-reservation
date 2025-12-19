// backend/src/routes/contact.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const prisma = new PrismaClient();
const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// POST /api/contact - Submit a message
router.post('/', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
], validate, async (req, res) => {
    const { name, email, message, userId } = req.body;

    try {
        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                message,
                userId: userId ? parseInt(userId) : null
            }
        });
        res.json({ success: true, contact });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to submit message' });
    }
});

module.exports = router;
