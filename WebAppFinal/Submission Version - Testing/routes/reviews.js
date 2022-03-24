const express = require("express");
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const Submission = require("../models/submission");
const Review = require("../models/review");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const submission = await Submission.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    submission.reviews.push(review);
    await review.save();
    await submission.save();
    req.flash("success", "Created new review!");
    res.redirect(`/submissions/${submission._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Submission.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/submissions/${id}`);
  })
);

module.exports = router;
