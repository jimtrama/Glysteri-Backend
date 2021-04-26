const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        sunbed: {
            type: String,
            required: true
        },
        mac: {
            type: String,
            required: false
        }

    }, { timestamps: true }
);

const OrderModel = mongoose.model('orders', OrderSchema);

module.exports = OrderModel;