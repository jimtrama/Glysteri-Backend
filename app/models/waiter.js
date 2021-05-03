const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WaiterSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        sunbeds: {
            type: Array,
            required: true
        },
        sunbedss: {
            type: String,
            required: true
        }

    }, { timestamps: true }
);

const WaiterModel = mongoose.model('waiters', WaiterSchema);

module.exports = WaiterModel;