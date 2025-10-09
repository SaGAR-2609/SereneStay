const Listing = require("../models/listings.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id).populate({path : "reviews" , populate : {path : "author"}}).populate("owner");
    if(!list){
        req.flash("error" , "The listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { list });
};

module.exports.createNewListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success" , "Successfully made a new listing");
    res.redirect("/listings");

};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error" , "The listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { list });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , "Successfully updated the listing");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Successfully deleted the listing");
    res.redirect("/listings");
};