const express = require("express");

// Import validator
const {
  createOrUpdateReviewValidator,
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

// Make router
const router = express.Router();

// Make some routes
router.post("/", createOrUpdateReviewValidator, createReview);
router.get("/", getAllReviews);

router.get("/:id", getDetailValidator, getDetailReview);
router.put("/:id", createOrUpdateReviewValidator, updateReview);
router.delete("/:id", deleteReview);

// Exports
module.exports = router;
