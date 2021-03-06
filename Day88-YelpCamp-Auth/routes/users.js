const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../helpers/catchAsync");
const User = require("../models/user");

// Register
router.get("/register", (req, res) => {
  res.render("users/register");
});
// Post request to register user
router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, err => {
        if(err) return next(err);
      })
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect('/campgrounds')
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

// Login
router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/');
})

module.exports = router;
