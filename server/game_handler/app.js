// app.js, JN, 24.04.2024
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const createAppRouter = require('./routes/appRouter');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let queuedPlayers = [];

// Initialize app router
const appRouter = createAppRouter(queuedPlayers);
app.use('/app', appRouter);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle joining the queue
    socket.on('join-queue', () => {
        if (queuedPlayers.length < 5) {
            queuedPlayers.push(socket.id);
            io.emit('queue-number', queuedPlayers.length);
            if (queuedPlayers.length === 5) {
                io.emit('game-ready');
            }
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
        const index = queuedPlayers.indexOf(socket.id);
        if (index !== -1) {
            queuedPlayers.splice(index, 1);
            io.emit('queue-number', queuedPlayers.length);
        }
    });
});

// TODO: Simulate game server

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
