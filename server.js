const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// start the database
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}`);
});
