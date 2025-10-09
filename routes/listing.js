const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");


router.get("/" , validateListing , wrapAsync(listingController.index));

router.route("/new")
    .get(isLoggedIn , listingController.renderNewForm)
    .post(isLoggedIn , validateListing, wrapAsync(listingController.createNewListing));

router.get("/:id/edit", isLoggedIn , isOwner , wrapAsync(listingController.editListing));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn , isOwner , validateListing , wrapAsync(listingController.updateListing))
    .delete(isLoggedIn , isOwner , wrapAsync(listingController.deleteListing));

module.exports = router;