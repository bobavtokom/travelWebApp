// middleware/authMiddleware.js

const authMiddleware = (req, res, next) => {
    if (!req.user) { 
      return res.status(401).json({ error: 'Unauthorized' });
      res.redirect('/login');
    }
    req.user = req.session.user;
    next(); 
  };
  
  module.exports = authMiddleware;
  