const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Function to get a random prompt
const getRandomPrompt = () => {
  const promptsFilePath = path.join(__dirname, 'prompts.txt');
  const usedPromptsFilePath = path.join(__dirname, 'used_prompts.json');

  try {
    let prompts = fs.readFileSync(promptsFilePath, 'utf-8').split('\n').filter(Boolean);
    let usedPromptsData = JSON.parse(fs.readFileSync(usedPromptsFilePath, 'utf-8'));

    const usedPrompts = new Set(usedPromptsData.used_prompts);
    const unusedPrompts = prompts.filter(prompt => !usedPrompts.has(prompt));

    if (unusedPrompts.length === 0) {
      usedPromptsData.used_prompts = [];
      fs.writeFileSync(usedPromptsFilePath, JSON.stringify(usedPromptsData, null, 2));
      return getRandomPrompt();
    }

    const randomPrompt = unusedPrompts[Math.floor(Math.random() * unusedPrompts.length)];
    usedPromptsData.used_prompts.push(randomPrompt);
    fs.writeFileSync(usedPromptsFilePath, JSON.stringify(usedPromptsData, null, 2));

    return randomPrompt;
  } catch (err) {
    console.error('Error generating prompt:', err);
    return null;
  }
};

// Route to get a random prompt
app.get('/api/prompt', (req, res) => {
  const prompt = getRandomPrompt();
  if (prompt) {
    res.json({ prompt });
  } else {
    res.status(500).json({ message: 'Error generating prompt' });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');

  // Define cron job to clear doodles daily at midnight (0 0 * * *)
  cron.schedule('0 0 * * *', async () => {
    try {
      await mongoose.connection.db.collection('doodles').deleteMany({});
      console.log('All doodles cleared successfully.');
    } catch (error) {
      console.error('Error clearing doodles:', error);
    }
  });
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/doodles', require('./routes/doodles'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
