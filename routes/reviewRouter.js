const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const {
  isLoggedIn,
  validateReviewSchema,
  isReviewUser,
} = require("../middleware/middleware.js");
const reviewController = require("../controllers/reviewController.js");

router.get("/review", reviewController.getReview);
// DELETE REVIEW

router.delete(
  "/review/:reviewId",
  isLoggedIn,
  isReviewUser,
  wrapAsync(reviewController.destroyReview)
);

// REVIEW

router.post(
  "/review",
  validateReviewSchema,
  isLoggedIn,
  wrapAsync(reviewController.createReview)
);

module.exports = router;
