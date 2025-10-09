const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        type : String,
        default: "https://unsplash.com/photos/large-cruise-ship-docked-in-a-harbor-at-dusk-Tp71k99hcBY",
        set: (v) => {
            if (!v || v.trim() === "") {
                return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
            }
            return v;
        }
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

listingSchema.post("findOneAndDelete" , async(listing) => {
    if(listing){
        await Review.deleteMany({ _id : {$in : listing.reviews}});
    };
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;