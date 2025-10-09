const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn } = require("../middleware.js");
const { savedURL } = require("../middleware.js");
const userController = require("../controller/user.js");

router.route("/signup")
    .get(userController.getSignupForm)
    .post(wrapAsync(userController.postSignup));

router.route("/login")
    .get(userController.getLoginForm)
    .post(savedURL , passport.authenticate("local" , { failureRedirect : "/login" , failureFlash : true}) , userController.postLogin);

router.get("/logout", isLoggedIn , userController.logout);

module.exports = router;