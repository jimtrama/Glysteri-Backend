const { MongoClient } = require("mongodb");
const mac = require("macfromip");
const Orders = require('./../models/order')
function main(io) {
  const callWaiter = function ({ sunbed, id }) {
    console.log(sunbed, id);
    let order = new Orders({
      sunbed
    })
    order.save();
    io.of("/admin").emit("waiter:called", { sunbed, id });
  };
  return {
    callWaiter,
  };
}

module.exports = main;
