
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

const requestRoutes = require('./routes/requestRoutes');
app.use('/api', requestRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
