const Book = require("../models/Book");

exports.getAllBooks = async (req, res) => {
  try {
    // filtering ✅

    // we must exclude the fields which we don't want currently to appear on the query
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // implementing gte, lte etc filtering
    // localhost:5000/?rating[gte]=4
    // but we get {gte: 4} -> we need {$gte: 4}
    // so we have to replace that with $
    // i hope this is understandable 😶
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`); // simple js, nothing to do with node

    let query = Book.find(JSON.parse(queryStr));

    // sorting ✅
    // as we din't awaited the let query we can chain many methods to it
    if (req.query.sort) {
      // if the query parameter has a sort property in it then implement the sort functionality

      // we can have multiple query parameters -> localhost:5000/?sort=-rating,date
      // we need to replace the comma(,) with a space( )
      const sortBy = req.query.sort.split(",").join(" ");
      // console.log(sortBy);

      query = query.sort(sortBy);
    } else {
      // default sorting
      query = query.sort("-date");
    }

    // field limiting ✅
    if (req.query.fields) {
      // we will receive multiple fields, so we also replace the comma(,) with a space( ) here
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      // if the user doesn't specify any fields than we will remove the __v field
      query = query.select("-__v"); // - is to exclude the field
    }

    // pagination ✅

    // query will look like this -> localhost:5000?page=2&limit=10
    // page=2&limit=10 ==> skip(10).limit(10) ==> skip(10) means it will start at page 11-20 and skip 10
    // for page 3 => page=3&limit=10 ==> skip(20).limit(10) ==> means it will start at page 21 and skip the page 20
    // so on and on...
    const page = req.query.page * 1 || 1; //converting the string value to int value by mul
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const totalBooks = await Book.countDocuments();
      // Book.countDocuments() will return the total number of documents in collection
      // now we have to see if the skip value is greater than the totalBooks value or not
      // if the skip value is greater, than we know that the page doesn't exists
      // So we threw an Error, as a try catch block, this error will passed to the catch block
      if (skip >= totalBooks) throw new Error("This page doesn't exists");
    }

    const books = await query;

    res.status(200).json({
      result: books.length, // total number of result
      data: {
        books,
      },
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createBook = async (req, res) => {
  const book = new Book(req.body);

  try {
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatedBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "successfully deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.publishedBooks = async (req, res) => {
  try {
    const publishedBook = await Book.find({
      status: "published",
    });
    res.status(200).json({
      result: publishedBook.length,
      data: {
        publishedBook,
      },
    });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
