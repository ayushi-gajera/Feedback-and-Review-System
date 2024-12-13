const { reviewSchemas } = require("../schema.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");

module.exports.validateReviewSchema = (req, res, next) => {
  const { error } = reviewSchemas.validate(req.body);
  if (error) {
    let errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errorMsg);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectURL = req.originalUrl;
    req.flash("error", "You are not Logged In");
    return res.redirect("/");
  }
  next();
};

module.exports.saveRedirectURL = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }
  next();
};

module.exports.isReviewUser = async (req, res, next) => {
  const authorId = "67573a1333bf95c9ee5144c9";
  const currUser = req.user;
  if (currUser._id.toString() != authorId) {
    req.flash("error", "You are not the author");
    return res.redirect(`/review`);
  }
  next();
};
