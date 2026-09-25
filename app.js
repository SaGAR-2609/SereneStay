if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");

// IMPORTANT: Correct CommonJS import for connect-mongo v6
const { MongoStore } = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/users.js");
const userRoutes = require("./routes/users.js");

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");

// ==========================
// MongoDB Connection
// ==========================

const mongo_url = process.env.MONGO_URL;

mongoose
    .connect(mongo_url)
    .then(() => {
        console.log("MongoDB connection successful");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

// ==========================
// Express Configuration
// ==========================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));

// ==========================
// Session Configuration
// ==========================

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

const sessionOptions = {
    secret: process.env.SECRET,

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 7 * 24 * 60 * 60
    }),

    cookie: {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }
};

app.use(session(sessionOptions));

app.use(flash());

// ==========================
// Passport Configuration
// ==========================

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========================
// Flash Messages & Current User
// ==========================

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    next();
});

// ==========================
// Demo User Route
// ==========================

app.get("/demouser", async (req, res, next) => {
    try {
        const fakeUser = new User({
            email: "fakeuser@gmail.com",
            username: "fakeuser"
        });

        const registeredUser = await User.register(
            fakeUser,
            "helloworld"
        );

        res.send(registeredUser);
    } catch (err) {
        next(err);
    }
});

// ==========================
// Routes
// ==========================

app.use("/listings", listingRoutes);

app.use("/listings/:id/reviews", reviewRoutes);

app.use("/", userRoutes);

// ==========================
// 404 Error Handler
// ==========================

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!!"));
});

// ==========================
// General Error Handler
// ==========================

app.use((err, req, res, next) => {
    const {
        statusCode = 500,
        message = "Something went wrong!"
    } = err;

    res.status(statusCode).render("error.ejs", {
        message
    });
});

// ==========================
// Vercel
// ==========================

module.exports = app;