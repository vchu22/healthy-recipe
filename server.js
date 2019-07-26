var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var helmet = require('helmet');
require('dotenv').config();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

/* security settings */
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.hidePoweredBy());
app.use(helmet.xssFilter());
var domain;
// force https
// app.get('*', function (req, res, next) {
//   if (req.headers['x-forwarded-proto'] !== 'https') {
//     domain = req.get('host');
//     res.redirect(`https://${domain}${req.url}`);
//   }
//   else
//     next(); // Continue to other routes if we're not redirecting
// })
var firstReq = true;
// request the homepage
app.get('/', function (req, res) {
  if (firstReq) {
    // get the domain of the server by extracting the info from the first user request
    domain = req.headers.host;
    firstReq = false;
  }
  res.render('index', {
    food2fork: process.env.food2fork,
    nutritionixId: process.env.nutritionixId,
    nutritionixKey: process.env.nutritionixKey,
  });
});

/* used for bypassing the same-origin policy to request external webpages */
app.get('/fetch/:portocal/:url', function (req, res) {
  console.log('User requested ' + req.params.url);
  var referrer = req.get('Referrer');
  request(req.params.portocal + '://' + req.params.url, function (
    error,
    response,
    body
  ) {
    // check if the request is legitimate
    if (
      !error &&
      typeof referrer !== 'undefined' &&
      referrer === `https://${domain}/`
    ) {
      res.send(body);
    } else {
      console.log(error);
      res.send(0);
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}, go to http://localhost:${port}`);
  console.log('Server started');
});
