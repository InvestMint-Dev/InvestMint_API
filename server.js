// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const companyInformationRoutes = require('./routes/companyInformation');
const investingQuestionnaireRoutes = require('./routes/investingQuestionnaire');

const app = express();
app.use(express.json());

// Use CORS middleware
app.use(cors({
    origin: 'https://investmint-dev.github.io', // Allow requests from your frontend origin
    methods: 'GET,POST,PUT,DELETE',  // Specify the allowed HTTP methods
    credentials: true                // If you want to allow cookies to be sent
  }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

  

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/companyInformation', companyInformationRoutes);
app.use('/api/investingQuestionnaire', investingQuestionnaireRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
