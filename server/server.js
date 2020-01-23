const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const joi = require("joi");

const db = require("./db");
const collection = require("../config/keys").Collection;
const app = express();
app.use(bodyParser.json());

const schema = joi.object().keys({
  character: joi
    .string()
    .max(1)
    .required(),
  meaning: joi.string().required()
});

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

  joi.validate(userInput, schema, async (err, result) => {
    if (err) {
      const error = new Error("Invalid Input");
      error.status = 400;
      next(error);
    } else {
      // check if the character exists in the data base already
      const exists =
        (await db
          .getDB()
          .collection(collection)
          .find({ character: userInput.character })
          .count()) > 0;

      if (exists) {
        // if the character exists send an error msg back
        const error = new Error("character is already there");
        error.status = 400;
        next(error);
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
                msg: `Successfully inserted ${userInput.character}`,
                error: null
              });
            }
          });
      }
    }
  });
});

app.use((err, req, res, next) => {
  res.status(err.status).json({
    error: {
      message: err.message
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
