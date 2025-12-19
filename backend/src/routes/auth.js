// backend/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
const JWT_EXPIRES = '7d';

const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Register new user
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('phone').trim().notEmpty(),
    body('nationalId').trim().notEmpty(),
    body('userType').isIn(['visitor', 'employee']).optional()
], validate, async (req, res) => {
    const { firstName, lastName, nationalId, phone, email, dob, nationality, address, postalCode, userType, password } = req.body;
    try {
        const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }, { nationalId }] } });
        if (existing) return res.status(409).json({ error: 'User with same email/phone/nationalId already exists' });
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { firstName, lastName, nationalId, phone, email, dob: new Date(dob), nationality, address, postalCode, userType, passwordHash }
        });
        const token = jwt.sign({ userId: user.id, email: user.email, userType: user.userType }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, userType: user.userType } });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], validate, async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ userId: user.id, email: user.email, userType: user.userType }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, userType: user.userType } });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user (protected)
router.get('/me', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, userType: user.userType });
    } catch (e) {
        console.error(e);
        res.status(403).json({ error: 'Invalid token' });
    }
});

module.exports = router;
