// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

const authRouter = require('./routes/auth');
const venuesRouter = require('./routes/venues');
const bookingsRouter = require('./routes/bookings');
const paymentsRouter = require('./routes/payments');
const profileRouter = require('./routes/profile');

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRouter);
app.use('/api/venues', venuesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/contact', require('./routes/contact'));

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Public Places Reservation API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
