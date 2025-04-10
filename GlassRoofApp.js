const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// MongoDB Atlas connection
const mongoURI = 'mongodb+srv://bengulliano:ZjrCKZbk1rxRYV9J@glassroof.9rut2d0.mongodb.net/?retryWrites=true&w=majority&appName=GlassRoof';
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