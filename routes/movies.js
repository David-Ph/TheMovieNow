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
router.get("/categories", MovieController.getAllCategories);
router.post("/", MovieController.createMovie);
router.put("/:id", MovieController.updateMovie);
router.delete("/:id", MovieController.deleteMovie);

// ? export router
//////////////////
module.exports = router;
