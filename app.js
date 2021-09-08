const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const bookRoutes = require("./routes/bookRoutes");

app.use("/", bookRoutes);

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("successfully connected to the database!"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server started on port: ${port}`));
