const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assign = new Schema({
  staffId: {
      type: String,
      required: true
  },
  pumpId: {
      type: Number,
      required: true
  },
  start: {
      type: Date,
      required: true
  },
  end: {
      type: Date,
      required: true
  }
})


module.exports = mongoose.model("assign", assign);


