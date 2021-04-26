const mac = require("macfromip");
const Orders = require('./../models/order')
function main(io) {
  const callWaiter = function (socket, id, sunbed) {
    //{ sunbed, id }

    let ip = socket.handshake.address.split(":")[socket.handshake.address.split(":").length - 1];

    mac.getMac(ip, (e, mac) => {
      if (e) {

      } else {

        let order = new Orders({
          sunbed,
          mac
        })
        console.log(ip, mac, sunbed);
        //order.save();
        io.of("/admin").emit("waiter:called", { sunbed, id });
      }
    });

  };
  return {
    callWaiter
  };
}

module.exports = main;
