const validator = require("validator");
const mongoose = require("mongoose");
const { Movie } = require("../../models");

exports.getDetailValidator = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next({ message: "ID Is Not Valid", statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.createOrUpdateReviewValidator = async (req, res, next) => {
  try {
    /* Validate the user input */
    const errorMessages = [];

    if (!mongoose.Types.ObjectId.isValid(req.body.user_id)) {
      errorMessages.push("User ID Is Not Valid");
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.movie_id)) {
      errorMessages.push("Movie ID Is Not Valid");
    }

    if (!validator.isInt(req.body.rating)) {
      errorMessages.push("Rating Must Be Number");
    }

    if (!validator.isLength(req.body.textContent)) {
      errorMessages.push("Text Content Not Must Be Empty");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    /* Find user and movie is exist or not */
    const data = await Promise.all([
      user.findOne({ _id: req.body.user_id }),
      movie.findOne({ _id: req.body.movie_id }),
    ]);

    if (!data[0] || !data[1]) {
      errorMessages.push("User Or Movie Not Found");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
