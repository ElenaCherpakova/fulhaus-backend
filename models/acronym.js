const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const acronymSchema = new Schema({
  acronym: {
    type: String,
    required: true,
  },
  definition: {
    type: String,
    required: true,
  },
});

const Acronym = mongoose.model('Acronym', acronymSchema);
module.exports = Acronym;