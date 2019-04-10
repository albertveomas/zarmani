const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const debt = new Schema({
    memberId: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    pumpId: {
        type: Number,
        required: true
    },
    staffId: {
        type: String,
        required: true
    }
    date: {
        type: Date,
        required: true
    }
})


module.exports = mongoose.model("debt", debt);


