const { Movie } = require("../../models");
const categories = require("../../config/categories");
const validator = require("validator");
const { promisify } = require("util");

exports.movieValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (validator.isEmpty(req.body.title)) {
      errorMessages.push("Title cannot be empty!");
    }

    if (!validator.isDate(req.body.releaseDate)) {
      errorMessages.push(
        "Release date not valid! Please enter a date in YYYY-MM-DD format"
      );
    }

    if (!validator.isInt(req.body.budget)) {
      errorMessages.push("Budget not valid! Please enter a number");
    }
  } catch (error) {
    next(error);
  }
};
