const express = require('express');
const router = express.Router();

const init = function (app) {
    app.get('/favicon.ico', (req, res, next) => {res.end('ignore favicon')});
    app.use('/', require('./default'));
};

exports.init = init;