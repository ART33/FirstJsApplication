const mongoose = require('mongoose');
const winston = require('winston');

mongoose.set('useCreateIndex', true);

module.exports = function () {
    mongoose.connect('mongodb://localhost/vidly', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => winston.info('Connected to MongoDB...'));
}