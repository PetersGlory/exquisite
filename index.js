require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const usersRoute = require("./src/routes/users");
const adminRoutes = require("./src/routes/admin");
const driversRoute = require("./src/routes/drivers");
const generalRoute = require("./src/routes/general");
const PORT= process.env.PORT;
// const db = require('./src/config/db');
const userIoFunction = require('./src/controllers/userController/userIoFunctions');
const chat = require('./src/middleware/chat');

const app = express();

const socket_io = require('socket.io');
const io = socket_io();

io.listen(app.listen(PORT, ()=>{
    console.log(`server is listening  on ${PORT}`);
}));

app.use(express.json());

app.use(bodyParser.json());
 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors({
    origin: '*',
    credentials: true
}));

//static page for testing images
app.use(express.static('public'));

const users = [];

app.use('/api/users',usersRoute);
app.use('/api/drivers',driversRoute);
app.use('/api/general',generalRoute);
app.use('/api/admin',adminRoutes);

// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});

io.on("connection", onConnected);

function onConnected(socket){
    console.log(`User connected: ${socket.id}`)

    socket.on('connect',(data) =>{
        users[data] = socket.id;
        console.log(data)
        // connectWithDriver(data)
    });
    
    socket.on('connecting-driver', (data)=>{
        console.log(data);
        connectWithDriver(data);
    });

    socket.on('disconnect', ()=>{
        console.log(`User Disconnected: ${socket.id}`)
    });

    socket.on('order', (data)=>{
        console.log(data);
        newDriverRide(data);

    });

    socket.on('track-Order', (data)=>{
        userIoFunction.trackOrder(data);
    });
    
    socket.on('chatAI', (data)=>{
        chat.chatAI(data);
    })
}

