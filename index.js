
require('dotenv').config();
const { App, mongoose } = require('./src/init.js');
require('./src/api/ratingsApi.js')

const port = process.env.PORT || 4000;
MONGODB_URI = process.env.MONGODB_URI;

async function run() {
    const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(MONGODB_URI, clientOptions)
            .then(() => console.log('Connected to MongoDB Atlas', mongoose.connection.db.databaseName))
            .then(() => {
                App.listen(port, () => {
                    console.log(`Server running on port ${port}`);
                });
            })
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Handle app termination gracefully
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await mongoose.disconnect();
    process.exit(0);
});

run().catch(console.dir);


// API Routes
// Simple route
App.get('/', (req, res) => {
    res.send(`Hello from ${process.env.HELLO}`);
});

