const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Import path for serving static files
const { createServer } = require('http'); // Import HTTP server
const initializeWebSocket = require('./utils/websocket');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const courseRoutes = require('./routes/courseRoutes');
const todo = require('./routes/todo');
const dashboard = require('./routes/dashboardRoutes');
const flaggedUsers = require('./routes/flaggedUsers');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve the React build folder
const buildPath = path.join(__dirname, '../frontend', 'build'); // Path updated for frontend/build
app.use(express.static(buildPath));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/users', todo);
app.use('/api', dashboard);
app.use('/api/flagged', flaggedUsers);

// Handle React routing, return index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(buildPath, 'index.html'));
});

// Create HTTP server and initialize WebSocket
const server = createServer(app); // Use HTTP server
initializeWebSocket(server); // Pass the server to WebSocket initializer

// Connect to MongoDB and start the server
mongoose
  .connect('mongodb+srv://user:user@cluster0.aiuzp.mongodb.net/?retryWrites=true&w=majority&appName=Clusters0')
  .then(() => {
    console.log('Connected to MongoDB 🚀');
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} 🚀`));
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err));
