// Get dependencies
const express      = require('express');
const path         = require('path');
const http         = require('http');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
var expressSession = require('express-session');

const app = express();
var router = express.Router();

// Parsers for POST data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());

// Point static path to dist
//app.use(express.static(path.join(__dirname, 'dist')));

// Add headers
router.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

router.get('/setCookies', function(req, res){
    res.cookie('my','cookie');
    console.log("call")
    res.send('set');
});

router.get('/getCookies', function(req, res){
  console.log(" ==== ", req.cookies);
  res.send(req.cookies);
})

// Get our API routes
require('./routes/connection')
require('./routes/api');
require('./routes/login')(router);

// Set our api routes
app.use('/api', router);

// Catch all other routes and return the index file
/* router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
}); */

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));