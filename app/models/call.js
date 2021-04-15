const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CallSchema = new Schema(
    {
        tabel:{
            type:String,
            required:true
        },
        mac:{
            type:String,
            required:true
        }
        
    },{timestamps:true}
);

const CallModel = mongoose.model('calls',CallSchema);

module.exports = CallModel;