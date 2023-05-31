
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require("ejs");

app.set("view engine", "ejs");
app.use(express.static('public'));
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/firstdb');
  console.log("db connected");
};
const Schema = mongoose.Schema;
const mySchema = new Schema({
  id: Number,
  title: String,
  class: String,
  imageUrl: String,
  imageText: String,
  description: String,
  likes: Number,
  dislikes: Number
});
const DestinationModel = mongoose.model('DestinationModel', mySchema);

const worldTravel = new DestinationModel({
    id: "2",
    class: "",
    title: "Tyrol Austria",
    imageUrl: "https://www.shutterstock.com/image-photo/village-inneralpbach-alpbach-valleyaustriatirol-260nw-543923905.jpg",
    imageText: "Tyrol Austria",
    description: "Tyrol is a western Austrian state in the Alps that&apos;s known for its ski resorts, historic sites and folk traditions. The capital city, Innsbruck, surrounded by mountains, is home to Habsburg Empire landmarks like baroque-style Hofburg Palace and Gothic Hofkirche Church. The city&apos;s symbol is the 15th-century Goldenes Dachl, a loggia topped with gleaming copper tiles commissioned by Habsburg Emperor Maximilian",
    likes: "0",
    dislikes: "0"
});
// worldTravel.save()
//   .then((result) => {
//     console.log('Data saved successfully:', result);
//   })
//   .catch((error) => {
//     console.error('Error saving data:', error);
//   });


app.listen(process.env.PORT || 8080, () => console.log("server started"));

app.get("/", function(req, res){
    res.render("pages/index");
});
app.get("/about", function(req,res){
    res.render('pages/about');
});
app.get("/contact", function(req,res){
    res.render('pages/contact');
});

app.get('/home', async (req, res) => {
    DestinationModel.find()
    .then((data) => {
      res.render('pages/htmlApp', { data });
    })
    .catch((err) => {
        if (err) {
            console.error('Error fetching data from MongoDB:', err);
            return res.status(500).send('Internal Server Error');
        }
    });
  });
  