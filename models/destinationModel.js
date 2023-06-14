const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const destinationSchema = new mongoose.Schema({
  title : String,
  klass: { type: String, default: "" },
  description: String,
  imageUrl: String,
  imageText: { type: String, default: "" },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 }
});
  
const DestinationModel = mongoose.model('DestinationModel', destinationSchema);
module.exports = DestinationModel;