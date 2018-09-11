// call the packages we need
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set port
let port = process.env.PORT || 8080;

// database
let database = require('./db/database');
database
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// register API routes
require('./routes/routes')(router, database);
app.use('/api', router);

// start the server
app.listen(port);
console.log(`Listening on port ${port}`);