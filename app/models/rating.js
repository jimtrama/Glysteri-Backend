const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema(
    {
        ratings: {
            type: Array,
            required: true
        },
        comment: {
            type: String,
            required: false
        },
        mac: {
            type: String,
            required: false
        },
        time: {
            type: Number,
            required: true
        }

    }, { timestamps: true }
);

const RatingModel = mongoose.model('ratings', RatingSchema);

module.exports = RatingModel;