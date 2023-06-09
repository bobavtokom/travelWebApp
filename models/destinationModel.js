const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mySchema = new Schema({
  title: String,
  klass: { type: String, default: "" },
  imageUrl: String,
  imageText: { type: String, default: "" },
  description: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 }
});
const DestinationModel = mongoose.model('DestinationModel', mySchema);
module.exports = DestinationModel;