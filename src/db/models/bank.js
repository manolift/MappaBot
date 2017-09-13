const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const bankSchema = new Schema({
  belongsTo: {
    type: ObjectId,
    ref: 'user'
  },
  amount: {
    type: Number,
    required: true,
    default: 500,
  },
  lastSet: Date,
  lastGet: Date,
});

module.exports = mongoose.model('bank', bankSchema);
