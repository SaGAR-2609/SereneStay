const Listing = require("./models/listings");
const ExpressError = require("./utils/expressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = ((req , res , next) => {
    if(!req.isAuthenticated()){
        req.session.redirectedUrl = req.originalUrl;
        req.flash("error" , "You must be logged in first");
        return res.redirect("/login");
    }
    next();
});

module.exports.savedURL = ((req , res , next) => {
    if(req.session.redirectedUrl){
        res.locals.redirectedUrl = req.session.redirectedUrl;
    }
    next();
});

module.exports.isOwner = (async (req , res ,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error" , "You do not have the permission.");
        return res.redirect(`/listings/${id}`);
    }
    next();
});

module.exports.validateListing = (req , res , next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
};

module.exports.validateReview = (req , res , next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
};

module.exports.isAuthor = (async (req , res ,next) => {
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error" , "You are not the author.");
        return res.redirect(`/listings/${id}`);
    }
    next();
});

module.exports.geocode = async (req, res, next) => {
  const locationString = `${req.body.listing.location}, ${req.body.listing.country}`;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}`
  );

  const data = await response.json();

  if (data.length > 0) {
    req.geoData = {
      lat: data[0].lat,
      lon: data[0].lon
    };
  } else {
    req.geoData = null;
  }
  
  next();
};