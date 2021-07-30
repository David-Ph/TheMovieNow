const express = require("express");
const router = express.Router();

// ? import controllers
// //////////////////////
const MovieController = require("../controllers/movies");

// ? import validators
// ////////////////////

// ? set routers
// //////////////
router.get("/", MovieController.getAllMovies);
router.get("/title", MovieController.getMoviesByTitle);
router.get("/categories", MovieController.getMoviesByCategory);
router.get("/categories/all", MovieController.getAllCategories);
router.get("/:id", MovieController.getMovieById);

router.post("/", MovieController.createMovie);
router.put("/:id", MovieController.updateMovie);
router.delete("/:id", MovieController.deleteMovie);

// ? export router
//////////////////
module.exports = router;
