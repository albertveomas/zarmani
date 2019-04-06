const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplier = new Schema({
    phone: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("supplier", supplier);


