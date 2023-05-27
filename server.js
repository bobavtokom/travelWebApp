const express = require('express');
const app = express();
const ejs = require("ejs");

app.set("view engine", "ejs");
app.use(express.static('public'));

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