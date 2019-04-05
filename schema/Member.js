const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const member = new Schema({
    memberId: {
        type: Number,
        required: true
    },
    Name: {
    	type: String,
    	required: true
    },
    code:{
        type:String,
        required: true
    },
    memberConfirm: {
    	type: Boolean,
    	required: true
    }
})


module.exports = mongoose.model("Member", member);


