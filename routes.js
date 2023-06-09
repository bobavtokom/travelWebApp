const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DestinationModel = require('./models/destinationModel');
const ChatMessage = require('./models/LiveChatModel');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const isLoggedIn = require('./middleware/authenticationMiddleware');

router.get("/", function(req, res){
    res.render("pages/index", { req: req });
});
router.get("/destination/:id", function(req, res){
  const showId = req.params.id;
  DestinationModel.findById({_id: showId})
  .then((data) => {
    res.render('pages/show', {article: data});
  })
});
router.get("/about", function(req,res){
    res.render('pages/about',{ req: req });
});
router.get("/contact", function(req,res){
    res.render('pages/contact',{ req: req });
});

router.get('/create', isLoggedIn,(req, res) => {
    res.render("pages/create", { req: req });
});

router.post('/create', function(req, res) {
  console.log('created');
  const { title, description, imageText, imageUrl, likes, dislikes, klass } = req.body;
  const newDestination = new DestinationModel
  ({ title, description, imageText, imageUrl, likes, dislikes, klass});
  newDestination.save()
  .then(() => {
    console.log('Data saved');
    res.redirect('/home');
  })
  .catch((err) => {
    console.error('Error saving data', err);
    res.redirect('/create');
  });
});

router.post('/delete-article/:id', function(req, res) {
  const articleId = req.params.id;
  DestinationModel.findByIdAndDelete({_id: articleId})
  .then(() => {
    res.status(200).send(articleId);
  })
  .catch((error) => {
    console.log(error);
    res.status(404).send();
  });
});

router.get('/save-article/:id', isLoggedIn,(req, res) => {
  const articleId = req.params.id;
  DestinationModel.findById({_id: articleId})
  .then((data) => {
    res.render("pages/save-article", {article: data, req: req});
  })
  .catch(() => {
    res.render("pages/save-article", {article: { _id: 0, title: "", description: "", imageText: "", imageUrl: "", likes: 0, dislikes: 0 }, req: req});
  });
});

router.post('/save-article', function(req, res) {
  const {_id, title, description, imageText, imageUrl, likes, dislikes} = req.body;
  let articleId = 0;
  if (_id === "0") {
    articleId = 0;
  } else {
    articleId = _id;
  }
  const likesInt = parseInt(likes);
  const dislikesInt = parseInt(dislikes);
  DestinationModel.updateOne( 
    { _id: articleId }, 
    { $set: 
        {
          title: title,
          description: description,
          imageText: imageText,
          imageUrl: imageUrl,
          likes: likesInt,
          dislikes: dislikesInt
        }
    })
  .then(() =>{
    res.redirect('/display');
  })
  .catch((error) => {
    const newDestination = new DestinationModel
    ({ title, description, imageText, imageUrl});
    newDestination.save()
    .then(() => {
      res.redirect('/display');
    })
    .catch((err) => {
      console.error('Error saving data', err);
    });
  });
});

router.get('/display',  isLoggedIn,(req, res) => {
  DestinationModel.find()
  .then((data) => {
    res.render('pages/display',{data: data, req: req})
  }
)});

router.get('/home', async (req, res) => {
    DestinationModel.find()
    .then((data) => {
      res.render('pages/htmlApp', { data: data, req: req });
    })
    .catch((err) => {
      if (err) {
          console.error('Error fetching data from MongoDB:', err);
          return res.status(500).send('Internal Server Error');
      }
  });
});
 // Add these routes after the '/home' route

router.get("/topLiked/:n", async (req, res) => {
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
router.post('/like/:id', async (req, res) => {
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
router.post('/dislike/:id', async (req, res) => {
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

router.get('/messages', async (req, res) => {
  try {
    // Retrieve all chat messages from the database
    const messages = await ChatMessage.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

module.exports = router;
