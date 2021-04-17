const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const Ratings = require('./app/models/rating');
const Orders = require('./app/models/order')
app.use(cors({ origin: "*" }));
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");

const port = 8080;
let users = 0;
app.use(bodyParser.urlencoded({ extended: true }));
const { callWaiter } = require("./app/routes/waiter")(io);
io.on("connection", (socket) => {
  users++;
  console.log("someone connected:" + users);
  socket.on("waiter:call", callWaiter);
  //socket.disconnect();
  socket.on("disconnect", () => {
    users--;
    console.log("someone disconnected :" + users);
  });
});

// io.of("/admin").on("connection", (socket) => {
//   socket.on("waiter:comming", waiterComming);
// });
app.get("/commentsadd", (req, res) => {
  let d = new Ratings(
    {
      rating: [false, true],
      comment: "fdi"
    }
  )
  d.save();
  res.send("f");
});
app.get("/commentsget", async (req, res) => {
  res.send({ data: await Ratings.find() });
});
app.get("/gethistory", async (req, res) => {
  res.send({ data: await Orders.find() });
});
app.get("/clearhistory", async (req, res) => {
  console.log("deleting");
  await Orders.deleteMany({
    "createdAt": {
      //"$lt": new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1)
      "$lt": new Date()
    }
  }
  )
  res.send({ data: await Orders.find() });
});
mongoose.connect("mongodb://localhost:27017/glysteri").then(res => {

  http.listen(port, () => {
    console.log('Connected to Db');
    console.log("listening on port :" + port);
  });
}).catch(() => {
  console.log("something whent wrong");
})

