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
  socket.on("disconnect", () => {
    console.log("admin disconnected");
  })
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
app.post("/commentsadd", (req, res) => {
  let freeCommnet = req.body.comment;
  let userRatings = JSON.parse(req.body.ratings);

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
  if (ip.split(".").length == 3 && myip != ip) {
    mac.getMac(ip, (e, mac) => {
      if (e) {
        let newRating = new Ratings(
          {
            ratings: userRatings,
            comment: freeCommnet,
            "mac": "error",
            time: Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24))
          }
        )
        newRating.save();
        res.send({ success: true, mac: false });
        return;
      } else {
        let newRating = new Ratings(
          {
            ratings: userRatings,
            comment: freeCommnet,
            mac,
            time: Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24))
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
        ratings: userRatings,
        comment: freeCommnet,
        mac: "same",
        time: Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24))
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
  let start = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24));
  let orders = await Orders.find({
    time: {
      "$gte": start
    }
  })
  res.send({ data: orders });
  //res.send({ data: await Orders.find() });
});
app.get("/clearhistory", async (req, res) => {
  console.log("deleting");
  await Orders.deleteMany({
    time: {
      '$lt': Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24))
    }
  });

  res.send({ data: await Orders.find() });
});
app.get("/ratingsWithin", async (req, res) => {
  let start = req.headers.start;
  let stop = req.headers.stop;
  let ratings = await Ratings.find({
    time: {
      "$lte": stop,
      "$gte": start
    }
  })
  res.send({ data: ratings });
})



mongoose.connect("mongodb://localhost:27017/glysteri").then(async res => {

  http.listen(port, () => {
    console.log('Connected to Db');
    console.log("listening on port :" + port);
  });
}).catch(() => {
  console.log("something whent wrong");
})

