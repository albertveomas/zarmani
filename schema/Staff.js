const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Staff = new Schema({
    messengerId: {
        type: String,
        required: true
    },
    staffId: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("Staff", Staff);


