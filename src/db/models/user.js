const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: String,
  kebabs: Number,
});

module.exports = mongoose.model('user', userSchema);
