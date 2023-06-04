
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require("ejs");
const http = require('http').Server(app);
const io = require('socket.io')(http);

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
    class: "",
    title: "Tyrol Austria",
    imageUrl: "https://www.shutterstock.com/image-photo/village-inneralpbach-alpbach-valleyaustriatirol-260nw-543923905.jpg",
    imageText: "Tyrol Austria",
    description: "Tyrol is a western Austrian state in the Alps that&apos;s known for its ski resorts, historic sites and folk traditions. The capital city, Innsbruck, surrounded by mountains, is home to Habsburg Empire landmarks like baroque-style Hofburg Palace and Gothic Hofkirche Church. The city&apos;s symbol is the 15th-century Goldenes Dachl, a loggia topped with gleaming copper tiles commissioned by Habsburg Emperor Maximilian",
    likes: "0",
    dislikes: "0"
});
const chatMessageSchema = new mongoose.Schema({
  content: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/views/chat.html');
// });

io.on('connection', (socket) => {
  console.log('A user connected.');

  // Broadcast chat messages to connected clients
  socket.on('chat message', (message) => {
    // Save the message to the database
    const chatMessage = new ChatMessage({
      content: message,
    });
    chatMessage.save();

    // Broadcast the message to connected clients
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});


const port = 8080;
http.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

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
 // Add these routes after the '/home' route

// Like action route
app.post('/like/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await DestinationModel.findById(articleId);

    if (!article) {
      return res.status(404).send('Article not found');
    }

    article.likes += 1;
    await article.save();

    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating like count:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Dislike action route
app.post('/dislike/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await DestinationModel.findById(articleId);

    if (!article) {
      return res.status(404).send('Article not found');
    }

    article.dislikes += 1;
    await article.save();

    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating dislike count:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/messages', async (req, res) => {
  try {
    // Retrieve all chat messages from the database
    const messages = await ChatMessage.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

