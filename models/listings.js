const mongoose = require("mongoose");
const schema = mongoose.Schema;

const listingSchema = new schema({
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
});

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;