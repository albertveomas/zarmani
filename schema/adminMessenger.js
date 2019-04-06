const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin = new Schema({
    messengerId: {
        type: String,
        required: true
    },
    adminId: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("admin-acc", admin);


