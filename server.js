const mongoose = require('mongoose');
const DestinationModel = require('./models/DestinationModel');
const ChatMessage = require('./models/LiveChatModel');
const express = require('express');
const app = express();
const path = require('path');
const ejs = require("ejs");
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/firstdb');
  console.log("db connected");
};

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
app.get("/destination/:id", function(req, res){
  const showId = req.params.id;
  DestinationModel.findById({_id: showId})
  .then((data) => {
    res.render('pages/show', {article: data});
  })
});
app.get("/about", function(req,res){
    res.render('pages/about');
});
app.get("/contact", function(req,res){
    res.render('pages/contact');
});
app.get('/create', function(req, res) {
  res.render("pages/create");
});

app.post('/create', function(req, res) {
  const {title, description, imageText, imageUrl} = req.body;
  const newDestination = new DestinationModel
  ({ title, description, imageText, imageUrl});
  newDestination.save()
  .then(() => {
    console.log('Data saved');
    res.redirect('/display');
  })
  .catch((err) => {
    console.error('Error saving data', err);
    res.redirect('/create');
  });
});


app.get('/display', (req, res) => {
  DestinationModel.find()
    .then((data) => {
      res.render('pages/display',{data})
    }
    )});

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

 app.get("/topLiked/:n", async (req, res) => {
  const topN = req.params.n;
  DestinationModel.find().sort({likes: -1}).limit(topN)
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((err) => {
    if (err) {
      console.error('Error getting top liked destination.', err);
      res.status(500).send('Internal Server Error');
    }
  })
 });

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

