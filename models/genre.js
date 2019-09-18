const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

// Validate the name of the genres
function validateGenres(genre) {
    const schema = {
        name: Joi.string().min(3).required(),
    };

    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validate = validateGenres;