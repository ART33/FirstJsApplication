const mongoose = require('mongoose');
const express = require('express');
const Fawn = require('fawn');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { Rental, validate } = require('../models/rental');
const router = express.Router();

Fawn.init(mongoose);

// Get the list of rentals
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

// Create a new rental
router.post('/', async (req, res) => {
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
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

        res.send(rental);
    } catch (ex) {
        res.status(500).send('Something failed.');
    }
});

module.exports = router;