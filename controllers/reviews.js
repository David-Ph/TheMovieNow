const { Review, Movie } = require("../models");

class Reviews {
  async getAllReviews(req, res, next) {
    try {
      let data = await Review.find();

      if (data.length === 0) {
        return next({ message: "Reviews Not Found", statusCode: 404 });
      }

      for (let i = 0; i < data.length; i++) {
        data[i].Movie = await Movie.findOne({
          _id: data[i].Movie,
        });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getDetailReview(req, res, next) {
    try {
      let data = await Review.findById({ _id: req.params.id });

      if (!data) {
        return next({ message: "Review Not Found", statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createReview(req, res, next) {
    try {
      const newData = await Review.create(req.body);

      const data = await Review.findOne({
        _id: newData._id,
      });

      res
        .status(201)
        .json({ data, message: "New Review Successfully Created!" });
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req, res, next) {
    try {
      // Update data
      let data = await Review.findOneAndUpdate(
        { _id: req.params.id },
        req.body, // This is all of req.body
        { new: true }
      );
      if (!data) {
        return next({ message: "Review Not Found", statusCode: 404 });
      }

      // If success
      return res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const data = await Review.delete({ _id: req.params.id });

      if (!data) {
        return next({ message: "Review Not Found", statusCode: 404 });
      }

      res.status(200).json({ message: "Review Has Been Deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Reviews();
