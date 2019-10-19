const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const { Genre, validate } = require('../models/genre');
const router = express.Router();
const admin = require('../middleware/admin');

// Get the list of genres
router.get('/', async (req, res) => {
  const genres = await Genre.find()
    .select('-__v')
    .sort('name');
  res.send(genres);
});

// Create a new genres
router.post('/', auth, async (req, res) => {
  // Validating
  // If invalidate, return 400 - Bad request
  const { error } = validate(req.body);

  // 400 Bad Request
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

// Update a genre
router.put('/:id', [auth, validateObjectId], async (req, res) => {
  // Validating
  // If invalidate, return 400 - Bad request
  const { error } = validate(req.body);

  // 400 Bad Request
  if (error) return res.status(400).send(error.details[0].message);

  // Look up and update the genre
  // If not existing, return 404
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name
    },
    { new: true }
  );
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');

  // return the updated genre
  res.send(genre);
});

// Deleting Genres
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  // Look up and delete the genre
  // If not existing, return 404
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');

  // Return the same genre
  res.send(genre);
});

// Get the genre by ID
router.get('/:id', validateObjectId, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send('Invalid ID');
  // Look up the genre
  // If not existing, return 404
  const genre = await Genre.findById(req.params.id).select('-__v');
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');

  res.send(genre);
});

module.exports = router;
