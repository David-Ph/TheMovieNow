const express = require("express");
const router = express.Router();

// ? import controllers
// //////////////////////
const MovieController = require("../controllers/movies");

// ? import validators
// ////////////////////
const {
  movieValidator,
  queryMovieValidator,
} = require("../middlewares/validators/movies");

// ? set routers
// //////////////
router.get("/", queryMovieValidator, MovieController.getMoviesByPage);
router.get("/all", queryMovieValidator, MovieController.getAllMovies);
router.get("/search", queryMovieValidator, MovieController.getMoviesByTitle);
router.get(
  "/categories/all",
  queryMovieValidator,
  MovieController.getAllCategories
);
router.get(
  "/categories/:tag",
  queryMovieValidator,
  MovieController.getMoviesByCategory
);
router.get("/:id", MovieController.getMovieById);
// anything below needs admin token/auth
router.post("/", movieValidator, MovieController.createMovie);
router.put("/:id", movieValidator, MovieController.updateMovie);
router.delete("/:id", MovieController.deleteMovie);

// ? export router
//////////////////
module.exports = router;
