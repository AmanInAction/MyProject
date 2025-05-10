const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("../MyProject/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

let port = 8080;

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hey!! I am root");
});

app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});

app.post("/listings", async (req,res) => {
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

app.put("/listings/:id", async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing},{new:true,runValidators:true});
    res.redirect("/listings/id");
});

app.delete("/listings/:id",  async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});