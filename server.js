const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const Ratings = require('./app/models/rating');
const Orders = require('./app/models/order');
const mac = require("macfromip");
const { networkInterfaces } = require('os');
require('dotenv').config();
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

const port = process.env.PORT;
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
io.of("/admin").on("connection", (socket) => {
  console.log("admin Connected");
})

// app.get("/", async (req, res) => {
//   let orders = await Orders.find();
//   let ratings = await Ratings.find();
//   console.log("Ff");
//   res.send({ succes: true, "orders": JSON.stringify(orders), "ratings": JSON.stringify(ratings) })
// })
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
  let freeCommnet = req.headers.comment;
  let userRatings = req.headers.ratings;
  let ip = req.socket.remoteAddress.split(":")[req.socket.remoteAddress.split(":").length - 1];
  const nets = networkInterfaces();
  const results = {}

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  const myip = results.en0[0];
  if (ip != myip) {
    mac.getMac(ip, (e, mac) => {
      if (e) {
        let newRating = new Ratings(
          {
            rating: [false, true],
            comment: "fdi",
            "mac": "error"
          }
        )
        newRating.save();
        res.send({ success: true, mac: false });
        return;
      } else {
        let newRating = new Ratings(
          {
            rating: [false, true],
            comment: "fdi",
            mac
          }
        )
        newRating.save();
        res.send({ success: true, mac: true });
        return;
      }
    })

  } else {
    let newRating = new Ratings(
      {
        rating: [false, true],
        comment: "fdi",
        mac: "same"
      }
    )
    newRating.save();
    res.send({ success: false });
  }


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
      "$lt": new Date()
    }
  }
  )
  res.send({ data: await Orders.find() });
});



mongoose.connect("mongodb://localhost:27017/glysteri").then(async res => {

  http.listen(port, () => {
    console.log('Connected to Db');
    console.log("listening on port :" + port);
  });
}).catch(() => {
  console.log("something whent wrong");
})

