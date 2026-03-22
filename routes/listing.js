const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner , validateListing , geocode} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });

router.get("/" , validateListing , wrapAsync(listingController.index));

router.route("/new")
    .get(isLoggedIn , listingController.renderNewForm)
    .post(isLoggedIn, validateListing, geocode, upload.single('listing[image]'), wrapAsync(listingController.createNewListing));

router.get("/:id/edit", isLoggedIn , isOwner , wrapAsync(listingController.editListing));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn , isOwner , validateListing , upload.single('listing[image]') , wrapAsync(listingController.updateListing))
    .delete(isLoggedIn , isOwner , wrapAsync(listingController.deleteListing));

module.exports = router;