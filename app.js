const express = require('express');

const app = express();
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce Backend API');
});

module.exports = app;
