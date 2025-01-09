const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Define a route that responds with "Hello, World"
app.get('/', (req, res) => {
  res.send('Hello, World 🌍'); // This will display "Hello, World" in the browser
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`);
});
