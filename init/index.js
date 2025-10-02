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
    initData.data = initData.data.map((obj) => ({...obj , owner : "68de5de5c8e5206e26b3f074"}))
    await Listing.insertMany(initData.data);
    console.log("Your initial data has been inserted in the database successfully");
};

initDB();