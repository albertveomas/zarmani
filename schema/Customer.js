const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customer = new Schema({
    messengerId: {
        type: String,
        required: true
    },
    memberID: {
        type: Number,
        required: true
    }
})


module.exports = mongoose.model("customer", customer);


