const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const db = require("./db");
const collection = require("../config/keys").Collection;
const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../", "public")));

// get all kanji
app.get("/getKanji", (req, res) => {
  db.getDB()
    .collection(collection)
    .find({})
    .toArray((err, documents) => {
      if (err) {
        console.log(err);
      } else {
        console.log(documents);
        res.json(documents);
      }
    });
});

// create
app.post("/", (req, res, next) => {
  const userInput = req.body;
  console.log(userInput.character);
  console.log("check if character  is there");

  // check if the character exists in the data base already
  db.getDB()
    .collection(collection)
    .find({ character: userInput.character })
    .count()
    .then(count => {
      console.log("count", count);
      if (count > 0) {
        // TODO: add error handling to let the user know the character already exists
      } else {
        // if the character doesn't already exist add it to the database
        db.getDB()
          .collection(collection)
          .insertOne(userInput, (err, result) => {
            if (err) {
              const error = new Error("failed to insert Todo document");
              error.status = 400;
              next(error);
            } else {
              res.json({
                result: result,
                document: result.ops[0],
                msg: "Successfully inserted Todo",
                error: null
              });
            }
          });
      }
    });
});

db.connect(err => {
  if (err) {
    console.log("unable to connect to database");
    process.exit(1);
  } else {
    app.listen(3000, () => {
      console.log("connected to database, app listening on port 3000");
    });
  }
});
