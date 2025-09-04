const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");

const mongo_url = "mongodb://127.0.0.1:27017/wanderer";

main().then((res) => console.log("Connection was successful"))
    .catch((err) => console.log(err));

async function main(){
    await mongoose.connect(mongo_url);
};

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded( {extended : true}));
app.use(methodoverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

//Checking all the required items working
app.get("/" , (req , res) => {
    res.send("All working fine till now");
});

// Home page
app.get("/listings" , async (req , res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs" , {allListings});
});

//Creating new listing
app.get("/listings/new" , (req , res) => {
    res.render("./listings/new.ejs");
});

//Adding the new listing to the database
app.post("/listings/new" , async (req , res) => {
    // let {title , description , image , price , location , country} = req.body;
    // const newListing = new Listing({
    //     title : title, description : description , image : image , price : price , location : location , country : country
    // });
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

// Edit Route
app.get("/listings/:id/edit" , async (req , res) => {
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("./listings/edit.ejs" , {list});
});

// Update Route
app.put("/listings/:id" , async (req , res) => {
    let {id} = req.params;
    const list = await Listing.findByIdAndUpdate(id , {...req.body.listing});
    console.log(list);
    res.redirect(`/listings/${id}`);
})

// DELETE Route
app.delete("/listings/:id" , async (req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

// Individual listing page
app.get("/listings/:id" , async (req , res) => {
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("./listings/show.ejs" , {list});
});

// app.get("/testListing" , async (req , res) =>{
//     let sample = new Listing({
//         title : "My Shimla Villa",
//         descreption : "On the top of the world with nature and peace",
//         price : 5000,
//         location: "Shimla Hill Station",
//         country : "India",
//     });
//     await sample.save();
//     console.log("sample was saved");
//     res.send(sample);
// })

app.listen(8080 , ()=> {
    console.log("App is listening on 8080...");
});