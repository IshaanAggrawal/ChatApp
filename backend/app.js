    const express = require('express');
    const cors = require('cors');
    const dotenv = require('dotenv');
    const cookieParser = require('cookie-parser');
    const connectdb = require('./utils/db');
    const http = require('http');
    const { Server } = require('socket.io');

    const authRoutes = require('./routes/user.route');
    const messageRoutes = require('./routes/message.route');

    dotenv.config();

    const app = express();
    const server = http.createServer(app);

    const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
    });

    io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('sendMessage', (message) => {
        socket.broadcast.emit('receiveMessage', message); //apne aap ko nahi bhejna hai
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
    });

    
    app.use(express.json({ limit: "5mb" }));
    app.use(express.urlencoded({ extended: true, limit: "5mb" }));
    app.use(cookieParser());

    app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
    }));

    
    app.use("/api/auth", authRoutes);
    app.use("/api/messages", messageRoutes);

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
    connectdb();
    console.log(`Server running at http://localhost:${PORT}`);
    });
