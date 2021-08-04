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

    /* Find id and movie is right or not */
    const newData = await data.findOne({
      _id: req.params.id,
      user_id: req.user.user,
    });

    if (!newData) {
      errorMessages.push("Data Not Found");
    }

    if (errorMessages.length > 0) {
      return next({ messages: errorMessages, statusCode: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
};
