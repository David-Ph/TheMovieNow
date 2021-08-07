const validator = require("validator");
const mongoose = require("mongoose");
const { Review } = require("../../models");

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

    if (req.body.user_id) {
      errorMessages.push("You don't need to input user_id");
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.movie_id)) {
      errorMessages.push("Movie ID Is Not Valid");
    }

    if (!validator.isInt(req.body.rating)) {
      errorMessages.push("Rating Must Be Number");
    }

    if (validator.isEmpty(req.body.text)) {
      errorMessages.push("Text Content Not Must Be Empty");
    }

    // insert currently logged in user's id
    // as the new review's user_id automatically
    const currentUser = req.user.user;
    req.body.user_id = currentUser;

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

    if (req.body.user_id) {
      errorMessages.push("You can not edit user_id");
    }

    if (req.body.movie_id) {
      errorMessages.push("You can not edit movie_id");
    }

    if (!validator.isInt(req.body.rating)) {
      errorMessages.push("Rating Must Be Number");
    }

    if (validator.isEmpty(req.body.text)) {
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

exports.checkUserValidator = async (req, res, next) => {
  try {
    /* Validate the user input */
    const errorMessages = [];

    const reviewToModify = await Review.findById({ _id: req.params.id });

    if (!reviewToModify) {
      return next({ message: "Review Not Found", statusCode: 404 });
    }

    /* check if currently logged in user
    has same id as updatedReview's user_id */
    const currentUser = req.user.user;
    if (currentUser != reviewToModify.user_id) {
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
