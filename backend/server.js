// Import required modules
const dotenv = require('dotenv').config({ path: './backend/.env' });

// dotenv.config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize environment variables

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


// User Routes
app.use('/api/users', require('./routes/userRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('Backend is working');
});

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
