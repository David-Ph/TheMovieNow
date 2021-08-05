const express = require("express");

// Import validator
const {
  createReviewValidator,
  updateReviewValidator,
  getDetailValidator,
  checkUserValidator,
} = require("../middlewares/validators/reviews");

// Import controller
const {
  createReview,
  getAllReviews,
  getDetailReview,
  getReviewsByMovie,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

// import auth
const { admin, user, adminOrUser } = require("../middlewares/auth/user");

// Make router
const router = express.Router();

// Make some routes
router.post("/", user, createReviewValidator, createReview);
router.get("/movie/:movieid", getReviewsByMovie);
router.get("/", getAllReviews);

router.get("/:id", getDetailValidator, getDetailReview);
router.put(
  "/:id",
  user,
  checkUserValidator,
  updateReviewValidator,
  updateReview
);
router.delete("/:id", user, checkUserValidator, deleteReview);

// Exports
module.exports = router;
