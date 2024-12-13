const Review = require("../models/review.js");

module.exports.getReview = async (req, res) => {
  let review = await Review.find();
  const authorId = "67573a1333bf95c9ee5144c9";
  const currUser = req.user;
  res.render("index.ejs", { review, authorId, currUser });
};

// DELETE REVIEW

module.exports.destroyReview = async (req, res) => {
  let { reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review is Deleted");
  res.redirect(`/review`);
};

// REVIEW

module.exports.createReview = async (req, res) => {
  let newReview = new Review(req.body.review);
  await newReview.save();
  req.flash("success", "Review Added");
  res.redirect(`/review`);
};
