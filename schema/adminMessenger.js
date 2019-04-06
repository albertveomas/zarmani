const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin = new Schema({
    adminId: {
        type: String,
        required: true
    },
    messengerId: {
        type: String,
        required: true
    }
    
})


module.exports = mongoose.model("admin-messenger", staff);


