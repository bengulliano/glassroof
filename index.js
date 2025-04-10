
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const App = express();
const port = process.env.PORT || 3000;
MONGODB_URI = process.env.MONGODB_URI

// MongoDB Atlas connection imported from .env file
// Example: mongoURI = 'mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/myapp?retryWrites=true&w=majority'
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas:glasswindow'))
    .catch(err => console.error('Connection error:', err));

// Simple route
App.get('/', (req, res) => {
    res.send('Hello from Render + MongoDB Atlas!');
});

App.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

App();

