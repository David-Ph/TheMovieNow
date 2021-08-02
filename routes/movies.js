const express = require("express");
const router = express.Router();

// ? import controllers
// //////////////////////
const MovieController = require("../controllers/movies");

// ? import validators
// ////////////////////
const { movieValidator } = require("../middlewares/validators/movies");

// ? set routers
// //////////////
router.get("/", MovieController.getMoviesByPage);
router.get("/all", MovieController.getAllMovies);
router.get("/search", MovieController.getMoviesByTitle);
router.get("/categories/all", MovieController.getAllCategories);
router.get("/categories/:tag", MovieController.getMoviesByCategory);
router.get("/:id", MovieController.getMovieById);

router.post("/", movieValidator, MovieController.createMovie);
router.put("/:id", movieValidator, MovieController.updateMovie);
router.delete("/:id", MovieController.deleteMovie);

// ? export router
//////////////////
module.exports = router;
