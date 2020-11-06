/* eslint-disable indent */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIES = require('./movies.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res
            .status(401)
            .json({ error: 'Unauthorized request' });
    }
    next();
});

app.get('/movie', (req, res) => {
    const { genre, country, avg_vote } = req.query;

    let results = MOVIES;

    if(genre) {
        results = results.filter(movie =>
            movie
                .genre
                .toLowerCase()
                .includes(genre.toLowerCase()));
    }

    if(country) {
        results = results.filter(movie =>
            movie
                .country
                .toLowerCase()
                .includes(country.toLowerCase()));
    }

    if(avg_vote) {
        results = results.filter(movie =>
            movie.avg_vote >= parseFloat(avg_vote));
    }

    res
        .json(results);
});

const PORT = 8000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Express is listening on Port: 8000');
});