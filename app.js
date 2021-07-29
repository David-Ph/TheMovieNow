// ? Import Dependencies
// //////////////////////
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

// ? import routes
// ////////////////

// ? import error handler
// //////////////////////
const errorHandler = require("./middlewares/errorHandler/errorHandler");

// ? use json and urlencoded
// /////////////////////////
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// ? set routes
// /////////////

app.all("*", async (req, res, next) => {
  try {
    next({
      messages: "Page not found",
      statusCode: 404,
    });
  } catch (error) {
    next(error);
  }
});

// ? use errorHandler
// ////////////////
app.use(errorHandler);

// ? listen to port
// //////////////////
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("Listening to 3000"));
}

module.exports = app;
