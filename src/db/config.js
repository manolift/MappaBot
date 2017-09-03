const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function init() {
  mongoose.connect('mongodb://localhost/mappabot');
}

module.exports = init;
