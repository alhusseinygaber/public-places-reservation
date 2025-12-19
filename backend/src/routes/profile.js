// backend/src/routes/profile.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticateToken);
const upload = require('../middleware/upload');

// POST /api/profile/upload-image
router.post('/upload-image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const userId = req.user.userId;
        const imagePath = `/uploads/${req.file.filename}`;

        await prisma.user.update({
            where: { id: userId },
            data: { profileImage: imagePath }
        });

        res.json({ message: 'Profile image updated', imagePath });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to update profile image' });
    }
});

// PUT /api/profile - Update user details
router.put('/', async (req, res) => {
    const userId = req.user.userId;
    const { firstName, lastName, phone, address } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                phone,
                address
            }
        });

        // safe return without password
        const { passwordHash, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// PUT /api/profile/password - Change password
router.put('/password', async (req, res) => {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Both old and new passwords are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const valid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!valid) return res.status(401).json({ error: 'Incorrect old password' });

        const newHash = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newHash }
        });

        res.json({ message: 'Password updated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
