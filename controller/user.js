const User = require("../models/users.js");

module.exports.getSignupForm = (req , res) => {
    res.render("users/signup.ejs");
};

module.exports.postSignup = async (req , res) => {
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
};

module.exports.getLoginForm = (req , res) => {
    res.render("users/login.ejs");
};

module.exports.postLogin = async (req , res) => {
    req.flash("success" , "Welcome back!!");
    res.redirect(res.locals.redirectedUrl || "/listings");
};

module.exports.logout = (req , res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "Successfully logged out");
        res.redirect("/listings");
    });
};