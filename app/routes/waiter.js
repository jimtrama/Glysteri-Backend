const { MongoClient } = require("mongodb");
const mac = require('macfromip');


function main(io) {

    const callWaiter = function ({sunbed,id}) {
        console.log(sunbed,id);
        io.of('/admin').emit('waiter:called',{sunbed,id})
    };
    return {
        callWaiter
    }
    // app.get('/call', (req, res) => {
    //     let ip = req.connection.remoteAddress.split(":");
    //     ip = ip[ip.length - 1];
    //     console.log(ip);
    //     mac.getMac(ip, (err, data) => {
    //         console.log(data);
    //         res.send(data)
    //     });

    // })
   

}

module.exports = main;

