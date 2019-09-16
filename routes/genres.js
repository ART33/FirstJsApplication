const express = require('express');
const Joi = require('joi');
const router = express.Router();

const genres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Adventure' },
    { id: 3, name: 'Comedy' },
    { id: 4, name: 'Crime' },
    { id: 5, name: 'Drama' },
    { id: 6, name: 'Fantasy' },
    { id: 7, name: 'Historical' },
    { id: 8, name: 'Horror' },
    { id: 9, name: 'Magical realism' },
    { id: 10, name: 'Mystery' },
    { id: 11, name: 'Paranoid fiction' },
    { id: 12, name: 'Romance' },
];

// Get the list of genres
router.get('/', (req, res) => {
    res.send(genres);
});

// Create a new genres
router.post('/', (req, res) => {
    // Validating 
    // If invalidate, return 400 - Bad request
    const { error } = validateGenres(req.body);

    // 400 Bad Request
    if (error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        name: req.body.name,
    };
    genres.push(genre);
    res.send(genre);
});

// Update a genre
router.put('/:id', (req, res) => {
    // Look up the genre
    // If not existing, return 404
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The genre with the given ID was not found");

    // Validating 
    // If invalidate, return 400 - Bad request
    const { error } = validateGenres(req.body);

    // 400 Bad Request
    if (error) return res.status(400).send(error.details[0].message);

    // Upadate genre
    genre.name = req.body.name;
    // return the updated genre
    res.send(genre);
});

// Deleting Genres
router.delete('/:id', (req, res) => {
    // Look up the genre
    // If not existing, return 404
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The genre with the given ID was not found");

    // Deleting
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    // Return the same genre
    res.send(genre);
});

// Get the genre by ID
router.get('/:id', (req, res) => {
    // Look up the genre
    // If not existing, return 404
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The genre with the given ID was not found");

    res.send(genre);

})

// Get the Genre by name
router.get('/:name', (req, res) => {
    // Look up the genre
    // If not existing, return 404
    const genre = genres.find(g => g.name === parseInt(req.params.name));
    if (!genre) return res.status(404).send("The genre with the given name was not found");

    res.send(genre);

})

// Validate the name of the genres
function validateGenres(genre) {
    const schema = {
        name: Joi.string().min(3).required(),
    };

    return Joi.validate(genre, schema);
}

module.exports = router;