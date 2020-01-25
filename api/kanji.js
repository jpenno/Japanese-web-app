const joi = require("joi");
const express = require("express");
const router = express.Router();

const db = require("../server/db");
const collection = require("../config/keys").kanjiCollection;

const schema = joi.object().keys({
  character: joi
    .string()
    .max(1)
    .required(),
  meaning: joi.string().required(),
  kunReading: joi.string().required(),
  onReading: joi.string().required(),
  jisyo: joi.string().required()
});

// @route  Get api/kanji
// @desc   get all kanji
// @access Public
router.get("/", (req, res) => {
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
// @route  Get api/kanji/:id
// @desc   get a kanji
// @access Public
router.get("/:id", (req, res) => {
  const kanjiID = req.params.id;

  db.getDB()
    .collection(collection)
    .find({_id: db.getPrimaryKey(kanjiID) })
    .toArray((err, documents) => {
      if (err) {
        console.log(err);
      } else {
        console.log(documents);
        res.json(documents);
      }
    });
});

// @route  Post api/kanji/
// @desc   Create a kanji
// @access Public
router.post("/", (req, res, next) => {
  const userInput = req.body;

  joi.validate(userInput, schema, async (err, result) => {
    if (err) {
      console.log(err);
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
// @route  DELETE api/kanji/:id
// @desc   Delete a kanji
// @access Public
router.delete("/:id", (req, res) => {
  const kanjiID = req.params.id;

  db.getDB()
    .collection(collection)
    .findOneAndDelete({ _id: db.getPrimaryKey(kanjiID) }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
});

module.exports = router;
