const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

// Validate the name of the genres
function validateGenres(genre) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
    };

    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validate = validateGenres;
exports.genreSchema = genreSchema;