const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatMessageSchema = new mongoose.Schema({
    content: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });
  
  const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
  module.exports = ChatMessage;