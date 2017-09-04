const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: String,
  kebabs: {
    type: Number,
    default: 50,
  },
});

module.exports = mongoose.model('user', userSchema);
