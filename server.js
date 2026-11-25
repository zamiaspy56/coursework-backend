// Load environment variables and libraries
require('dotenv').config();
const { MongoClient } = require('mongodb');
const express = require('express');

const app = express();
const PORT = 3000;

// Read JSON sent in requests
app.use(express.json());

// Connect to the existing MongoDB Atlas database
const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas!');
    } catch (error) {
        console.log('MongoDB connection failed:', error.message);
    }
}

connectDB();

// Retrieve lessons from the existing 'lesson' collection
app.get('/lessons', async function(req, res) {
    try {
        const database = client.db('snoopyschool');
        const lessons = await database.collection('lesson').find({}).toArray();
        res.json(lessons);
    } catch (error) {
        console.log('Error loading lessons:', error.message);
        res.status(500).json({ error: 'Failed to load lessons' });
    }
});

// PRACTICE ONLY: Save a test order. Add validation and stock checks before real bookings.
app.post('/orders', async function(req, res) {
    try {
        const database = client.db('snoopyschool');
        const result = await database.collection('order').insertOne(req.body);
        res.status(201).json({
            message: 'Order saved successfully!',
            orderId: result.insertedId
        });
    } catch (error) {
        console.log('Error saving order:', error.message);
        res.status(500).json({ error: 'Failed to save order' });
    }
});

app.listen(PORT, function() {
    console.log('Server running on port ' + PORT);
});
