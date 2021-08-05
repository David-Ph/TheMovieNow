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
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

// import auth
const { admin, user, adminOrUser } = require("../middlewares/auth/user");

// Make router
const router = express.Router();

// Make some routes
router.post("/", createReviewValidator, createReview); // need user token/auth
router.get("/", getAllReviews); // need getReviewByMovie

router.get("/:id", getDetailValidator, getDetailReview);
router.put(
  "/:id",
  user,
  checkUserValidator,
  updateReviewValidator,
  updateReview
);
router.delete("/:id", user, checkUserValidator, deleteReview); // need user token/auth

// Exports
module.exports = router;
