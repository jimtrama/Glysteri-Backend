const { MongoClient } = require("mongodb");
const mac = require("macfromip");

function main(io) {
  const callWaiter = function ({ sunbed, id }) {
    console.log(sunbed, id);
    io.of("/admin").emit("waiter:called", { sunbed, id });
  };
  return {
    callWaiter,
  };
}

module.exports = main;
