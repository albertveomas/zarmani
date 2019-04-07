const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fuel = new Schema({
   Name: {
       type: String,
       required: true
   },
   price: {
       type: Number,
       required: true
   }
})


module.exports = mongoose.model("fuel", fuel);


