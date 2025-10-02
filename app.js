const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
const userRoutes = require("./routes/users.js");

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderer";

main().then((res) => console.log("Connection was successful"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongo_url);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "thisismysupersecret",
    resave : false,
    saveUninitialized : true,
    cookie :{
        httpOnly : true,
        expires : Date.now() + (7*24*60*60*1000),
        maxAge : 7*24*60*60*1000,
    }
};
//Checking all the required items working
app.get("/", (req, res) => {
    res.send("All working fine till now");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser" , async (req , res) => {
    let fakeUser = new User({
        email : "fakeuser@gmail.com",
        username : "fakeuser"
    });
    let registeredUser = await User.register(fakeUser , "helloworld");
    res.send(registeredUser);
});

app.use("/listings" , listingRoutes);
app.use("/listings/:id/reviews" , reviewRoutes);
app.use("/" , userRoutes);

app.use( (req , res , next) => {
    next(new ExpressError(404 , "Page not found!!"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500 , message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(8080, () => {
    console.log("App is listening on 8080...");
});