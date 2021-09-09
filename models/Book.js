const mongoose = require("mongoose");
const randomIsbnGen = require("../utils/randomIsbnGen");

const BookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  isPublished: Boolean,
  ISBN: {
    type: String,
    default: randomIsbnGen(),
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Books", BookSchema);
