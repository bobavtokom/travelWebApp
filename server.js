const User = require('./models/userModel');
const mongoose = require('mongoose');
const DestinationModel = require('./models/destinationModel');
const ChatMessage = require('./models/LiveChatModel');
const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes');
const ejs = require("ejs");
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use the router as middleware
app.use('/', routes);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/firstdb');
  console.log("db connected");
};
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password' });
      }
    } catch (err) {
      return done(err);
    }
  }
));
// Serialize and deserialize user instances to and from the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('Dashboard page');
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return res.redirect('/dashboard');
    }
    res.redirect('/');
  });
});

app.get('/signup', (req, res) => {
  res.render('pages/signup');
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username: username });
    
    if (existingUser) {
      return res.redirect('/signup');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      password: hashedPassword
    });

    await newUser.save();
    req.login(newUser, (err) => {
      if (err) {
        console.log(err);
        return res.redirect('/signup');
      }

      return res.redirect('/dashboard');
    });
  } catch (err) {
    console.log(err);
    return res.redirect('/signup');
  }
});


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



