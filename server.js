const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

const getRandomPrompt = () => {
  const promptsFilePath = path.join(__dirname, 'prompts.txt');
  const usedPromptsFilePath = path.join(__dirname, 'used_prompts.json');

  let prompts;
  try {
    prompts = fs.readFileSync(promptsFilePath, 'utf-8').split('\n').filter(Boolean);
  } catch (err) {
    console.error('Error reading prompts.txt:', err);
    return null;
  }

  let usedPromptsData;
  try {
    usedPromptsData = JSON.parse(fs.readFileSync(usedPromptsFilePath, 'utf-8'));
  } catch (err) {
    console.error('Error reading used_prompts.json:', err);
    return null;
  }

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
};

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
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use('/api/doodles', require('./routes/doodles'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
