const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const event = new Schema({
    name: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("user", event);


