const express = require("express");
const {
  getAllBooks,
  createBook,
  getSingleBook,
  updatedBook,
  deleteBook,
  publishedBooks,
  getBookStats,
} = require("../controllers/bookController");

const router = express.Router();

// always define this kind of routes on top of all routes
// https://stackoverflow.com/a/54552580
router.route("/published").get(publishedBooks);
router.route("/book-stats").get(getBookStats);

router.route("/").get(getAllBooks).post(createBook);

router.route("/:id").get(getSingleBook).patch(updatedBook).delete(deleteBook);

module.exports = router;
