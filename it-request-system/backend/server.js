const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

// Ye route yahi likho
app.post('/submit-request', (req, res) => {
    const { name, email, message } = req.body;
    console.log('New request received:', name, email, message);

    res.status(200).json({ message: 'Request submitted successfully!' });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
