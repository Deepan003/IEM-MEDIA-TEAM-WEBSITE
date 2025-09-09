// Import the Express library
const express = require('express');

// Create an instance of an Express application
const app = express();

// Define a port number for our server to listen on
const PORT = 5001;

// Create a basic route for the homepage
// When someone visits '/', send back a simple message
app.get('/', (req, res) => {
  res.send('Hello from the IEM-PHOTOGRAPHY-CLUB server!');
});

// Start the server and make it listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});