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

  console.log("input", inputTime);

  if (inputTime) {
    // check valid YYYY-mm-dd format
    let validDate1 = new Date(inputTime)
    // check valid unix time
    let validDate2 = new Date(parseInt(inputTime))

    if (isNaN(validDate1.getMonth()) && isNaN(validDate2.getMonth())) {
      res.json({ error: "Invalid Date" })
    }

    if (isNaN(validDate1.getMonth())) {
      res.json({
        "unix": parseInt(inputTime),
        "utc": validDate2.toUTCString()
      })
    }
    else {
      res.json({
        "unix": validDate1.getTime(),
        "utc": validDate1.toUTCString()
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
