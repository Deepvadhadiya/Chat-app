const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db.jsx');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes.jsx');
const chatRoutes = require('./routes/chatRoutes.jsx');
const messageRoute = require('./routes/messageRoute.jsx');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware.jsx');
const path = require("path");

dotenv.config();

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("API is Running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoute);

// --------------------------deployment------------------------------

app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});

// --------------------------deployment------------------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`.blue.bold));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log('Connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User Joined Room: ' + room);
    });

    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log(`${chat.users} not defined`);
        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    })
});