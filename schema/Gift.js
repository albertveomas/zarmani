const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gift = new Schema({
    Name: {
        type: String,
        
    },
    point: {
        type: Number
    }
})


module.exports = mongoose.model("gift", gift);


