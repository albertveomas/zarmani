const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const giftReceived = new Schema({
    memberId: {
        type: String,
        required: true
    },
    gift: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})


module.exports = mongoose.model("giftReceived", giftReceived);


