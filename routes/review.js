const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , validateReview, isAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");


//Post Reviews Route
router.post("/" , isLoggedIn , validateReview , wrapAsync(reviewController.postReview));

// Delete Reviews route
router.delete("/:reviewId" , isLoggedIn , isAuthor , wrapAsync(reviewController.deleteReview));

module.exports = router;