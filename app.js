const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce Backend API');
});

module.exports = app;
