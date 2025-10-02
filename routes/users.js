const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn } = require("../middleware.js");
const { savedURL } = require("../middleware.js");

router.get("/signup" , (req , res) => {
    res.render("users/signup.ejs");
});

router.post("/signup" , wrapAsync(async (req , res) => {
    try{
        let {username , email , password} = req.body;
        const newUser = new User({username , email});
        let user = await User.register(newUser , password);
        req.login(user , (err) => {
            if(err) return next(err);
            req.flash("success" , "Welcome to SereneStay");
            res.redirect("/listings")
        });
    } catch (e) {
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}));

router.get("/login" , (req , res) => {
    res.render("users/login.ejs");
});

router.post("/login", savedURL , passport.authenticate("local" , { failureRedirect : "/login" , failureFlash : true}) , async (req , res) => {
    req.flash("success" , "Welcome back!!");
    res.redirect(res.locals.redirectedUrl || "/listings");
});

router.get("/logout", isLoggedIn , (req , res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "Successfully logged out");
        res.redirect("/listings");
    })
})

module.exports = router;