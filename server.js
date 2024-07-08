// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors module
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Use cors middleware

// Connect to MongoDB
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define routes
app.use('/api/doodles', require('./routes/doodles'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
