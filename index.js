const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/userRouter.js");
const reviewRouter = require("./routes/reviewRouter.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);


main()
  .then((res) => {
    console.log("Connection Successfully");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb://127.0.0.1:27017/feedback-and-review-system"
  );
}

// Sessions

const sessionOptions = {
  secret: "hello123",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Authentication

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
  
app.use("/", userRouter);
app.use("/", reviewRouter);

// ERROR HANDLING

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

app.use((err, req, res, next) => {
  let { StatusCode = 500, message = "Something went wrong" } = err;
  res.status(StatusCode).render("error.ejs", { message });
});

app.listen(8000, () => {
  console.log(`Server Started 8000`);
});
