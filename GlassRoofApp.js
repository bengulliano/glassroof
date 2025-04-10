const express = require('express');
const mongoose = require('mongoose');
const mongoURI = require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// MongoDB Atlas connection imported from .env file
// Example: mongoURI = 'mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/myapp?retryWrites=true&w=majority'
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas:glasswindow'))
    .catch(err => console.error('Connection error:', err));

// Simple route
app.get('/', (req, res) => {
    res.send('Hello from Render + MongoDB Atlas!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});