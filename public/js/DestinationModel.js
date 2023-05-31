const mongoose = require('mongoose');
const { Schema } = mongoose;

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

module.exports = DestinationModel;