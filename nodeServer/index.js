import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // In production, replace with your frontend URL
        methods: ['GET', 'POST']
    }
});

const users = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle new user joining
    socket.on('new-user-joined', (name) => {
        console.log('New user:', name);
        users[socket.id] = name;
        // Notify all other users that a new user joined
        socket.broadcast.emit('user-joined', name);
    });

    // Handle receiving messages and broadcasting them
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', {
            message,
            name: users[socket.id],
        });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        // Notify other users when a user leaves
        socket.broadcast.emit('left', users[socket.id]);
        // Delete the user from the users list
        delete users[socket.id];
    });
});

server.listen(8000, () => {
    console.log('Server running on port 8000');
});
