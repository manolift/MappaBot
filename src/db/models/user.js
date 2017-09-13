const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  userId: String,
  kebabs: {
    type: Number,
    default: 500,
  },
  bank: {
    type: ObjectId,
    ref: 'bank',
  }
});

module.exports = mongoose.model('user', userSchema);
