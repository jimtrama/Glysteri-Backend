const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const Ratings = require('./app/models/rating');
const Orders = require('./app/models/order');
const mac = require("macfromip");
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
  socket.on("waiter:call", ({ id, sunbed }) => { callWaiter(socket, id, sunbed) });
  //socket.disconnect();
  socket.on("disconnect", () => {
    users--;
    console.log("someone disconnected :" + users);
  });
});

// io.of("/admin").on("connection", (socket) => {
//   socket.on("waiter:comming", waiterComming);
// });

app.get("/login", async (req, res) => {
  let username = req.headers.username;
  let password = req.headers.password;
  if (username == "jim" && password == "jim") {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
})
app.get("/commentsadd", (req, res) => {
  let ip = req.socket.remoteAddress.split(":")[req.socket.remoteAddress.split(":").length - 1];

  mac.getMac(ip, (e, mac) => {
    if (e) {
      let newRating = new Ratings(
        {
          rating: [false, true],
          comment: "fdi",
          "mac": "error"
        }
      )
      //d.save();
      res.send({ success: true, mac: false });
    } else {
      let d = new Ratings(
        {
          rating: [false, true],
          comment: "fdi",
          mac
        }
      )
      console.log(ip, mac);
      //d.save();
      res.send({ success: true, mac: true });
    }
  })
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

