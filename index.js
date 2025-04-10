
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const App = express();
const port = process.env.PORT || 3000;
MONGODB_URI = process.env.MONGODB_URI


// Middleware
App.use(cors());
App.use(express.json());

console.log(MONGODB_URI);


// MongoDB Atlas connection imported from .env file
// Example: mongoURI = 'mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/myapp?retryWrites=true&w=majority'
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas:glasswindow')).then(() => {
        App.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => console.error('Connection error:', err));

// Simple route
App.get('/', (req, res) => {
    res.send('Hello from Render + MongoDB Atlas!');
});



//App();

