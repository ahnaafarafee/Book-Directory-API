const mongoose = require("mongoose");
const randomIsbnGen = require("../utils/randomIsbnGen");

const BookSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "A book must have a title"],
  },
  description: {
    type: String,
    required: [true, "A book must have a description"],
  },
  author: {
    type: String,
    required: [true, "A book must have a author"],
  },
  genre: {
    type: String,
    required: [true, "A book must have a genre"],
  },
  rating: {
    type: Number,
    min: [1, "rating must be above 1"],
    max: [5, "rating must be below 5"],
  },
  status: {
    type: String,
    enum: {
      values: ["published", "unpublished"],
      message: "Status is either published or unpublished",
    },
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
