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
    }
})


module.exports = mongoose.model("debt", debt);


