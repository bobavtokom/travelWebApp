const express = require('express');
const router = express.Router();
const DestinationModel = require('./destinationModel');

// Route for /destinations
router.get('/', async (req, res) => {
  try {
    const data = await DestinationModel.find();
    res.render('pages/destinations', { data });
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;