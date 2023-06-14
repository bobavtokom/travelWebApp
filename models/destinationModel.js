const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const destinationSchema = new mongoose.Schema({
    title : String,
    klass: String,
   description: String,
   imageUrl: String,
    imageText: String,
    likes: Number,
    dislikes: Number
  });
  
  const DestinationModel = mongoose.model('DestinationModel', destinationSchema);
  module.exports = DestinationModel;