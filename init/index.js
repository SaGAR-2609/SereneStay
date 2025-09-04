const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderer";

main().then((res) => console.log("Connection was successful"))
    .catch((err) => console.log(err));

async function main(){
    await mongoose.connect(mongo_url);
};

const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Your initial data has been inserted in the database successfully");
};

initDB();