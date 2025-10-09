const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");

module.exports.postReview = async (req , res) => {
    let {id} = req.params;
    const list  = await Listing.findById(id);

    let review = new Review(req.body.review);
    review.author = req.user._id;
    list.reviews.push(review);

    await review.save();
    await list.save();
    req.flash("success" , "Successfully added a new review");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req , res) => {
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Successfully deleted the review");
    res.redirect(`/listings/${id}`);
};