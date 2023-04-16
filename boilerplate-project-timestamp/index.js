// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api", function (req, res) {
  let currentTime = new Date()
  let unix = currentTime.getTime()
  let utc = currentTime.toUTCString()

  res.json({
    unix,
    utc
  })
});

app.get("/api/:time", function (req, res) {
  let inputTime = req.params.time;
  let currentTime = new Date()
  let unix = currentTime.getTime()
  let utc = currentTime.toUTCString()

  if (inputTime) {
    // check valid YYYY-mm-dd format
    let dateOne = new Date(inputTime)
    // check valid unix time
    let dateTwo = new Date(parseInt(inputTime))

    let validOne = isNaN(dateOne.getMonth())
    let validTwo = isNaN(dateTwo.getMonth())

    if (validOne && validTwo) {
      res.json({ error: "Invalid Date" })
    }

    if (validOne) {
      res.json({
        "unix": parseInt(inputTime),
        "utc": validTwo.toUTCString()
      })
    }
    else {
      res.json({
        "unix": dateOne.getTime(),
        "utc": dateOne.toUTCString()
      })
    }
  }

  res.json({
    unix,
    utc
  })
})



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
