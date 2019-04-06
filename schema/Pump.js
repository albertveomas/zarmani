const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pump = new Schema({
    pumpId: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("pump", pump);


