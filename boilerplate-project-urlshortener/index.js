require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Accessing dns module
const dns = require('dns');

// connect DB
require('./database');
let UrlModel = require('./models/shortUrl');

// encode body in request
let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// save posted url
app.post('/api/shorturl', function (req, res) {

  //  validate
  let valid = isValidUrl(req.body.url)

  if (!valid) {
    res.json({
      "error": "Invalid URL"
    })
  }

  let newUrl = req.body.url.replace(/^https?:\/\//, '')
  // check exist in DB
  UrlModel
    .findOne({
      original_url: newUrl
    }, function (err, data) {
      if (err) {
        res.json({ "error": "Server Error" })
      } else {
        // if exist
        if (data) {
          res.json({
            'original_url': `https://${data.original_url}`,
            'short_url': data._id
          })
        } else {
          // not exist
          let newModel = new UrlModel({
            original_url: newUrl
          })

          newModel
            .save(function (err, data) {
              console.log(err)
              if (err) {
                res.json({ "error": "Database Error" })
              } else {
                res.json({
                  'original_url': `https://${data.original_url}`,
                  'short_url': data._id
                })
              }
            })
        }
      }
    })
})

// find url based on id
app.get('/api/shorturl/:id', function (req, res) {
  let id = req.params.id;

  UrlModel
    .findById(id, function (err, data) {
      if (data) {
        res.redirect(302, `https://${data.original_url}`)
      } else {
        res.json({ "error": "No short URL found for the given input" })
      }
    })
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});


function isValidUrl(str) {
  const pattern = new RegExp(
    '^([a-zA-Z]+:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i'
  );
  return pattern.test(str);
}