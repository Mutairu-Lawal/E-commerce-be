const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce Backend API');
});

app.use('/api/v1/auth', authRoutes);

module.exports = app;
