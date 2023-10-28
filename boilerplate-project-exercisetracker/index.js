const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
require("./database");

let bodyParser = require("body-parser");
let userModel = require("./model/user.model");
// let logModel = require("./model/exercise.model");
let exerciseModel = require("./model/exercise.model");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

/**
 * Route Lists
 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", (req, res) => {
  userModel.find(function (err, data) {
    if (err) {
      res.json({ error: "Failed to query DB" });
    } else {
      res.json(data);
    }
  });
});

app.post("/api/users", (req, res) => {
  let cleanUsername = req.body.username ? req.body.username.trim() : null;

  if (cleanUsername) {
    // check or insert new
    userModel.findOne({ username: cleanUsername }, function (err, data) {
      if (err) {
        res.json({ error: "Failed to query DB" });
      } else {
        // if already exist, return
        if (data) {
          res.json({
            username: data.username,
            _id: data._id,
          });
        } else {
          // not exist, add new
          let newUser = new userModel({
            username: cleanUsername,
          });

          newUser.save(function (err, data) {
            if (err) {
              res.json({ error: "Failed to save new user" });
            } else {
              res.json({
                username: data.username,
                _id: data._id,
              });
            }
          });
        }
      }
    });
  } else {
    res.status(422).json({
      message: "Please fill in the username.",
    });
  }
});

app.post("/api/users/:id/exercises", (req, res) => {
  let userId = req.params.id;
  let { description, duration, date } = req.body;

  let cleanDesc = description.trim();
  let cleanDur = parseInt(duration);
  let cleanDate = date ? new Date(date) : new Date();

  let validDesc = cleanDesc.length > 0;
  let validDur = parseInt(cleanDur) > 0;
  let validDate = !isNaN(cleanDate.getMonth());

  if (validDesc && validDur && validDate) {
    userModel.findById(userId, function (err, user) {
      if (err) {
        res.json({ error: "Failed to find user" });
      } else {
        let newExercise = new exerciseModel({
          description: cleanDesc,
          duration: cleanDur,
          date: cleanDate,
          user: user._id,
        });

        newExercise.save(function (err, exercise) {
          if (err) {
            res.json({ error: "Failed to save new user" });
          } else {
            exerciseModel
              .findById(exercise._id)
              .populate("user")
              .exec((err, exercise) => {
                if (err) {
                  res.json({ error: "Failed to find exercise" });
                } else {
                  res.json({
                    _id: user._id,
                    username: user.username,
                    date: exercise.date.toDateString(),
                    duration: exercise.duration,
                    description: exercise.description,
                  });
                }
              });
          }
        });
      }
    });
  } else {
    res.status(422).json({
      message:
        "Wrong or missing details : " +
        `${validDesc ? "" : "Description, "}` +
        `${validDur ? "" : "Duration, "}` +
        `${validDate ? "" : "Date"}`,
    });
  }
});

app.get("/api/users/:id/logs", (req, res) => {
  let userId = req.params.id;
  let from = req.query.from ? new Date(req.query.from) : new Date(null);
  let to = req.query.to ? new Date(req.query.to) : new Date();
  let limit = req.query.limit ?? 50;

  userModel
    .find({ user: userId })
    .limit(limit)
    .exec((err, user) => {
      if (err) {
        res.json({ error: "Failed to find user" });
      } else {
        exerciseModel
          .find({
            date: {
              $gte: from,
              $lte: to,
            },
            user: userId,
          })
          .limit(limit)
          .exec((err, exercise) => {
            if (err) {
              res.json({ error: "Failed to find exercise" });
            } else {
              let log = exercise.map((val) => {
                return {
                  description: val.description,
                  duration: val.duration,
                  date: val.date.toDateString(),
                };
              });

              res.json({
                _id: user._id,
                username: user.username,
                count: exercise.length,
                log,
              });
            }
          });
      }
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
