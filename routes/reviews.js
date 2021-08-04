const express = require("express");

// Import validator
const {
  createReviewValidator,
  updateReviewValidator,
  getDetailValidator,
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
router.post("/", createReviewValidator, createReview);
router.get("/", getAllReviews);

router.get("/:id", getDetailValidator, getDetailReview);
router.put("/:id", user, updateReviewValidator, updateReview);
router.delete("/:id", deleteReview);

// Exports
module.exports = router;
