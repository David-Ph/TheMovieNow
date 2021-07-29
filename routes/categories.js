const express = require("express");
const router = express.Router();

// ? import controllers
// //////////////////////
const CategoryController = require("../controllers/categories");

// ? import validators
// ////////////////////

// ? set routers
// //////////////
router.get("/", CategoryController.getAllCategories);
router.post("/", CategoryController.createCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

// ? export router
//////////////////
module.exports = router;
