const validator = require("validator");
const mongoose = require("mongoose");
const { Movie, user, Review } = require("../../models");

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

exports.createReviewValidator = async (req, res, next) => {
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

    if (!validator.isLength(req.body.text)) {
      errorMessages.push("Text Content Not Must Be Empty");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.updateReviewValidator = async (req, res, next) => {
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

    if (!validator.isLength(req.body.text)) {
      errorMessages.push("Text Content Not Must Be Empty");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    const reviewToUpdate = await Review.findById({ _id: req.params.id });

    if (!reviewToUpdate) {
      return next({ message: "Review Not Found", statusCode: 404 });
    }

    /* Find id and movie is right or not */
    const currentUser = req.user.user;
    if (currentUser != reviewToUpdate.user_id) {
      return next({ statusCode: 403, messages: "Forbidden" });
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
