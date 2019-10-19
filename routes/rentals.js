const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { Rental, validate } = require('../models/rental');
const mongoose = require('mongoose');
const express = require('express');
const Fawn = require('fawn');
const router = express.Router();
const auth = require('../middleware/auth');

Fawn.init(mongoose);

// Get the list of rentals
router.get('/', auth, async (req, res) => {
  const rentals = await Rental.find()
    .select('-__v')
    .sort('-dateOut');
  res.send(rentals);
});

// Create a new rental
router.post('/', auth, async (req, res) => {
  // Validating
  // If invalidate, return 400 - Bad request
  const { error } = validate(req.body);
  // 400 Bad Request
  if (error) return res.status(400).send(error.details[0].message);

  // Validating customer
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer');

  // Validating customer
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock.');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  try {
    // rental = await rental.save();
    // movie.numberInStock--;
    // movie.save();
    new Fawn.Task()
      .save('rentals', rental)
      .update(
        'movies',
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send('Something failed.');
  }
});

router.get('/:id', [auth], async (req, res) => {
  const rental = await Rental.findById(req.params.id).select('-__v');

  if (!rental)
    return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router;
