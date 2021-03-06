const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const moment = require('moment');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

// Get the list of movies
router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

// Create
router.post('/', [auth], async (req, res) => {
  // Validating
  // If invalidate, return 400 - Bad request
  const { error } = validate(req.body);

  // 400 Bad Request
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    publishDate: moment().toJSON()
  });
  try {
    await movie.save();
    res.send(movie);
  } catch (ex) {
    for (field in ex.error) console.log(ex.error.details[0].message);
  }
});

// Update
router.put('/:id', [auth], async (req, res) => {
  // Validating
  // If invalidate, return 400 - Bad request
  const { error } = validate(req.body);

  // 400 Bad Request
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  // Look up and update the movie
  // If not existing, return 404
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found');

  // return the updated movie
  res.send(movie);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  // Look up and delete the movie
  // If not existing, return 404
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found');

  // Return the same movie
  res.send(movie);
});

// Find by Id
router.get('/:id', validateObjectId, async (req, res) => {
  // Look up the movie
  // If not existing, return 404
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found');

  res.send(movie);
});

module.exports = router;
