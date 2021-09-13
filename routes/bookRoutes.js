const express = require("express");
const Book = require("../models/Book");
const randomIsbnGen = require("../utils/randomIsbnGen");

const router = express.Router();

router.get("/", async (req, res) => {
  // we must exclude the fields which we don't want currently to appear on the query
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);

  // implementing gte, lte etc filtering
  // localhost:5000/?rating[gte]=4
  // but we get {gte: 4} -> we need {$gte: 4}
  // so we have to replace that with this
  // i hope this is understandable 😶
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`); // simple js, nothing to do with node

  const query = Book.find(JSON.parse(queryStr));
  const books = await query;

  try {
    res.status(200).json(books);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const book = new Book(req.body);

  try {
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "successfully deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// not working 👇
// try to do with aggregation pipeline
router.get("/published", async (req, res) => {
  try {
    const publishedBook = await Book.find({
      status: "published",
    });
    res.status(200).json(publishedBook);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

module.exports = router;
