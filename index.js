const express = require('express');
const helmet = require('helmet');
const root = require('./routes/root');
const genres = require('./routes/genres');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/', root);
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}... `));