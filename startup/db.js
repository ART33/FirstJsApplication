const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

mongoose.set('useCreateIndex', true);

module.exports = function () {
    const db = config.get('db');
    mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => winston.info(`Connected to ${db}...`));
}