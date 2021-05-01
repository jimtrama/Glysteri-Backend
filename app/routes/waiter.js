const mac = require("macfromip");
const Orders = require('./../models/order')
const { networkInterfaces } = require('os');
function main(io) {

  const callWaiter = function (socket, id, sunbed) {
    io.of("/admin").emit("waiter:called", { sunbed, id });
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
    let ip = socket.handshake.address.split(":")[socket.handshake.address.split(":").length - 1];
    if (ip.split(".").length != 3 || myip == ip) {
      let order = new Orders({
        sunbed,
        "mac": "same"
      })
      order.save();
      return;
    }
    mac.getMac(ip, (e, mac) => {
      if (e) {
        let order = new Orders({
          sunbed,
          "mac": "error"
        })
        order.save();
      } else {

        let order = new Orders({
          sunbed,
          mac
        })
        order.save();
      }
    });

  };
  return {
    callWaiter
  };
}

module.exports = main;
