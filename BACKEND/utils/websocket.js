const { Server } = require('socket.io');
const User = require('../models/User'); // Import User model with trackingSchema embedded

const initializeWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // Update with your frontend's URL in production
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle when a user joins a page
    socket.on('joinPage', async ({ userId, page, pageId }) => {
      try {
        console.log(`User ${userId} joined ${page} (Page ID: ${pageId || 'N/A'})`);

        const user = await User.findById(userId);
        if (!user) {
          console.error(`User not found for ID: ${userId}`);
          return;
        }

        // Add new tracking entry
        const trackingEntry = {
          page,
          pageId: pageId || null,
          startTime: new Date(),
          isActive: true,
          socketId: socket.id, // Store WebSocket ID
        };

        user.tracking.push(trackingEntry);
        await user.save();

        // Save tracking ID to the socket for cleanup on disconnect
        socket.trackingId = trackingEntry._id;
      } catch (error) {
        console.error('Error tracking page join:', error.message);
      }
    });

    // Handle when a user leaves a page
    socket.on('leavePage', async ({ userId, page, pageId }) => {
      try {
        console.log(`User ${userId} left ${page} (Page ID: ${pageId || 'N/A'})`);

        const user = await User.findById(userId);
        if (!user) {
          console.error(`User not found for ID: ${userId}`);
          return;
        }

        // Update the tracking entry in MongoDB
        const trackingEntry = user.tracking.find(
          (entry) => entry.page === page && entry.pageId === pageId && entry.isActive
        );

        if (trackingEntry) {
          trackingEntry.endTime = new Date();
          trackingEntry.isActive = false;
          await user.save();
        }
      } catch (error) {
        console.error('Error tracking page leave:', error.message);
      }
    });

    // Handle when the user disconnects
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.id}`);

      try {
        const user = await User.findOne({ 'tracking.socketId': socket.id });
        if (user) {
          user.tracking.forEach((entry) => {
            if (entry.socketId === socket.id && entry.isActive) {
              entry.endTime = new Date();
              entry.isActive = false;
            }
          });
          await user.save();
        }
      } catch (error) {
        console.error('Error handling disconnect:', error.message);
      }
    });
  });
};

module.exports = initializeWebSocket;
