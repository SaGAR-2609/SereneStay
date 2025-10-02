const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listings.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn , isOwner , validateListing , validateReview} = require("../middleware.js");

// Home page
router.get("/", validateListing , wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id).populate({path : "reviews" , populate : {path : "author"}}).populate("owner");
    if(!list){
        req.flash("error" , "The listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    console.log(list);
    res.render("./listings/show.ejs", { list });
}));

//Creating new listing
router.get("/new", isLoggedIn , (req, res) => {
    res.render("./listings/new.ejs");
});

//Adding the new listing to the database
router.post("/new", isLoggedIn , validateListing, wrapAsync(async (req, res, next) => {
    // let {title , description , image , price , location , country} = req.body;
    // const newListing = new Listing({
    //     title : title, description : description , image : image , price : price , location : location , country : country
    // });

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success" , "Successfully made a new listing");
    res.redirect("/listings");

}));

// Edit Route
router.get("/:id/edit", isLoggedIn , isOwner , wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error" , "The listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { list });
}));

// Update Route
router.put("/:id", isLoggedIn , isOwner , validateListing , wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , "Successfully updated the listing");
    res.redirect(`/listings/${id}`);
}));

// DELETE Route
router.delete("/:id", isLoggedIn , isOwner , wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Successfully deleted the listing");
    res.redirect("/listings");
}));

module.exports = router;