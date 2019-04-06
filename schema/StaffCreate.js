const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staff = new Schema({
    staffId: {
        type: Number,
        required: true
    },
    Name: {
    	type: String,
    	required: true
    },
    phone: {
        type: Number,
        required: true
    },
    code:{
        type:String,
        required: true
    },
    staffConfirm: {
    	type: Boolean,
    	required: true
    }
})


module.exports = mongoose.model("staff", staff);


