const mongoose = require('mongoose');
const { Customer, validate } = require('../models/customer');
const express = require('express');
const router = express.Router();



// Get the list of customers
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

// Create a new customers
router.post('/', async (req, res) => {
    // Validating 
    // If invalidate, return 400 - Bad request
    const { error } = validate(req.body);

    // 400 Bad Request
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    });
    try {
        await customer.save();
        res.send(customer);
    } catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message);
    };
});

// Update a customer
router.put('/:id', async (req, res) => {
    // Validating 
    // If invalidate, return 400 - Bad request
    const { error } = validate(req.body);

    // 400 Bad Request
    if (error) return res.status(400).send(error.details[0].message);


    // Look up and update the customer
    // If not existing, return 404
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone
    }, { new: true });
    if (!customer) return res.status(404).send("The customer with the given ID was not found");

    // return the updated customer
    res.send(customer);
});

// Deleting customers
router.delete('/:id', async (req, res) => {
    // Look up and delete the customer
    // If not existing, return 404
    const customer = await Genre.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send("The customer with the given ID was not found");

    // Return the same customer
    res.send(customer);
});

// Get the customer by ID
router.get('/:id', async (req, res) => {
    // Look up the customer
    // If not existing, return 404
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("The customer with the given ID was not found");

    res.send(customer);

})

// // Get the Genre by name
// router.get('/:id/:name', (req, res) => {
//     // Look up the genre
//     // If not existing, return 404
//     const genre = genres.find(g => g.id === parseInt(req.params.id) && g.name === req.params.name);
//     if (!genre) return res.status(404).send("The genre with the given name was not found");

//     res.send(genre);

// })



module.exports = router;