// At the very top, load the environment variables from the .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

// --- Connect to MongoDB ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully! ✅');
  } catch (error) {
    console.error('MongoDB Connection FAILED: ❌', error.message);
    // Exit the process with a failure code
    process.exit(1);
  }
};

// Call the function to connect to the database
connectDB();


// --- MIDDLEWARE ---
// This is a crucial step. It tells Express to automatically parse incoming JSON payloads.
// Without this, req.body in your controller would be undefined.
app.use(express.json());


// --- API ROUTES ---
// This tells our app to use the auth router for any requests that start with '/api/auth'
app.use('/api/auth', require('./routes/auth'));


// A basic route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Hello from the IEM Photography Club server!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});