// require to load env file
require('dotenv').config()

// handling different type of 'upload' body
let bodyParser = require('body-parser')
let express = require('express');
let app = express();

// console.log("Hello World")


// Serve static public assets using Middleware then bind Middleware to spefic path
const assetMiddlware = express.static(__dirname + "/public");
// 1. Serve to any route
// app.use(assetMiddlware);

// 2. Serve only for public route that call /public
app.use("/public", assetMiddlware);

// 3. Logging using middleware
app.use(function (req, res, next) {
    console.log(`${req.method} ${req.path} - ${req.ip}`)
    next()
})

app.get("/", function (req, res) {
    /**
     * response text
     */
    // res.send('Hello Express');

    /**
     * Response with file
     */
    let absolutePath = __dirname + '/views/index.html'
    res.sendFile(absolutePath);
})

/**
 * response JSON
 */
app.get("/json", function (req, res) {
    let type = process.env.MESSAGE_STYLE
    let text = "Hello json"
    res.json({
        "message": (type == 'uppercase')
            ? text.toUpperCase()
            : text
    });
})

/**
 * Chain middleware
 */
app.get("/now", function (req, res, next) {
    req.time = new Date().toString()
    next()
}, function (req, res) {
    res.json({
        "time": req.time
    })
})

/**
 * ROute parameter from address
 * 
 * route_path: '/user/:userId/book/:bookId'
 * actual_request_URL: '/user/546/book/6754'
 * req.params: {userId: '546', bookId: '6754'}
 */
app.get("/:word/echo", function (req, res, next) {

    res.json({
        "echo": req.params.word
    })
})

/**
 * ROute parameter from GET params
 * ?first=firstname&last=lastname
 * 
 * route_path: '/library'
 * actual_request_URL: '/library?userId=546&bookId=6754'
 * req.query: {userId: '546', bookId: '6754'}
 */
app.get("/name", function (req, res, next) {

    res.json({
        "name": `${req.query.first} ${req.query.last}`
    })
})

/**
 * ROute parameter from GET params for different method
 */
// app.get("/name", function(req, res, next){

//     res.json({
//         "name" : `${req.query.first} ${req.query.last}`
//     })
// }).post("/name", function(req, res, next){

//     res.json({
//         "name" : `${req.query.first} ${req.query.last}`
//     })
// })

// extend bodyparser middleware to any route
// When extended=false it uses the classic encoding querystring library. 
// When extended=true it uses qs library for parsing.
app.use(bodyParser.urlencoded({ extended: false }));

/**
* passing POST body
* 
* route: POST '/library'
* urlencoded_body: userId=546&bookId=6754
* req.body: {userId: '546', bookId: '6754'}
*/
app.post("/name", function (req, res, next) {

    res.json({
        "name": `${req.body.first} ${req.body.last}`
    })
})















module.exports = app;
