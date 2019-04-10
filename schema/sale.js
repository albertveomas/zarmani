const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sale = new Schema({
    memberId: {
        type: String,
        required: true
    },
    point: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})


module.exports = mongoose.model("sale", sale);


