const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Import routes
const themoviedbRoutes  = require('./routes/themoviedb');
const authRoutes        = require('./routes/auth');
const movieRoutes       = require('./routes/movies');

// Use routes
app.use('/api/themoviedb', themoviedbRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));