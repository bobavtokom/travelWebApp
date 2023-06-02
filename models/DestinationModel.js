const mongoose = require('mongoose');
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

module.exports = DestinationModel;