const { Movie } = require("../models");

class MovieController {
  async getAllMovies(req, res, next) {
    try {
      const data = await Movie.find();
      if (data.length === 0) {
        return next({ message: "Movie not found", statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createMovie(req, res, next) {
    try {
      const newData = await Movie.create(req.body);

      const data = await Movie.findOne({
        _id: newData._id,
      });

      res
        .status(201)
        .json({ data, message: "New Movie Successfully Created!" });
    } catch (error) {
      next(error);
    }
  }

  async updateMovie(req, res, next) {
    try {
      const newData = await Movie.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      if (!newData) {
        return next({ statusCode: 404, message: "Movie not found" });
      }

      res.status(201).json({ newData, message: "Movie successfully updated!" });
    } catch (error) {
      next(error);
    }
  }

  async deleteMovie(req, res, next) {
    try {
      //   for soft delete
      const data = await Movie.deleteById(req.params.id);

      if (data.nModified === 0) {
        return next({ statusCode: 404, message: "Movie not found" });
      }

      res.status(200).json({ message: "Movie successfully deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MovieController();
