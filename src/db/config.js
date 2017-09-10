const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function init() {
  mongoose.connect('mongodb://localhost/mappabot', { useMongoClient: true });
}

module.exports = init;
