const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({ origin: '*' }));

const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


const MongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");




const port = 8080;
let users = 0;
app.use(bodyParser.urlencoded({ extended: true }));
const { callWaiter } = require('./app/routes/waiter')(io);
io.on('connection', socket => {
    let nowSec = new Date().getTime();
    // setInterval(() => {
    //     let int = new Date().getTime();
    //     console.log(int);
    // }, 1000);
    
    users++;
    console.log("someone connected:" + users);
    socket.on('waiter:call', callWaiter);
    //socket.disconnect();
    socket.onAny(() => {

    })
    socket.on('disconnect', () => {
        users--;
        console.log("someone disconnected :" + users);
    })
    // socket.on('heartbeat',({socket})=>{
    //     console.log(socket);
    // })


})

io.of("/admin").on('connection', socket => {
    socket.on('waiter:comming', waiterComming);
})



http.listen(port, () => {
    console.log("listening on port :" + port);
})