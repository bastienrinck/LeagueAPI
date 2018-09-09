// call the packages we need
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let router = express.Router();

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set port
let port = process.env.PORT || 8080;

// register API routes
require('./routes/routes')(router);
app.use('/api', router);

// start the server
app.listen(port);
console.log(`Listening on port ${port}`);