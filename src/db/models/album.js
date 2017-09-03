const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const photoSchema = new Schema({
  link: String,
});

module.exports = mongoose.model('photos', photoSchema);
