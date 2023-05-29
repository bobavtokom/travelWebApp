
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require("ejs");

app.set("view engine", "ejs");
app.use(express.static('public'));
var db;
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/firstdb');
  console.log("db connected");
};
app.listen(process.env.PORT || 3000, () => console.log("server started"));

app.get("/", function(req, res){
    res.render("pages/index");
});
app.get("/home", function(req,res){
    res.render('pages/htmlApp');
});
app.get("/about", function(req,res){
    res.render('pages/about');
});
app.get("/contact", function(req,res){
    res.render('pages/contact');
});