const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        accesslvl: {
            type: Array,
        }

    }, { timestamps: true }
);

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;