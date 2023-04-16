require('dotenv').config();

// connect with DB
require("./database");

// create instance of a model
let Person = require('./models/person')

const createAndSavePerson = (done) => {
  let newPerson = new Person({
    name: "Hakam Raza",
    age: 27,
    favoriteFoods: [
      "cakes",
      "chicken",
      "fish"
    ],
  })

  newPerson
    .save(function (err, data) {
      if (err) return console.log(err);
      done(null, data);
    })
};

const createManyPeople = (arrayOfPeople, done) => {

  Person
    .create(arrayOfPeople, function (err, people) {
      if (err) return console.log(err);
      done(null, people);
    });

};

const findPeopleByName = (personName, done) => {
  Person
    .find({
      name: personName
    }, function (err, people) {
      if (err) return console.log(err);
      done(null, people);
    })
};

const findOneByFood = (food, done) => {
  Person
    .findOne({
      favoriteFoods: food
    }, function (err, people) {
      if (err) return console.log(err);
      done(null, people);
    })
};

const findPersonById = (personId, done) => {
  Person
    .findById(personId, function (err, people) {
      if (err) return console.log(err);
      done(null, people);
    })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  // .findById() method to find a person by _id with the parameter personId as search key. 
  Person
    .findById(personId, function (err, people) {
      if (err) return console.log(err);

      // Array.push() method to add "hamburger" to the list of the person's favoriteFoods
      people.favoriteFoods.push(foodToAdd)

      // and inside the find callback - save() the updated Person.
      people
        .save(function (err, data) {
          if (err) return console.log(err);
          done(null, data);
        })
    })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    {
      name: personName // search query
    },
    {
      age: ageToSet // field:values to update
    },
    {
      new: true, // return updated doc
      runValidators: true // validate before update
    },
    function (err, data) {
      if (err) return console.log(err);
      done(null, data);
    }
  );
};

const removeById = (personId, done) => {
  Person
    .findOneAndRemove({
      _id: personId // search query
    }, function (err, data) {
      if (err) return console.log(err);
      done(null, data);
    })
  
    // or this same thing
  // .findByIdAndRemove(personId, function(err, data){
  //   if (err) return console.log(err);
  //   done(null, data);
  // })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person
  .remove({
    name: nameToRemove // search query
  }, function (err, data) {
    if (err) return console.log(err);
    done(null, data);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person
    .find({ favoriteFoods: foodToSearch }) // find all has this food
    .sort({ name: 1 })      // sort ascending by name
    .limit(2)               // limit to 2 items
    .select({ age: false }) // hide age
    .exec(function (err, data) {    // lastly, execute
      if (err) return console.log(err);
      done(null, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
