const joi = require("joi");
const express = require("express");
const csv = require("jquery-csv");
const router = express.Router();

const db = require("../server/db");
const collection = require("../config/keys").vocabCollection;

const schema = joi.object().keys({
  word: joi.string().required(),
  meaning: joi.string().required(),
  reading: joi.string().required(),
  jisyoLink: joi.string().required(),
  kanjiInWord: joi.allow()
});

// @route  Post api/vocab/
// @desc   Create a vocab
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
              msg: `Successfully inserted ${userInput.word}`,
              error: null
            });
          }
        });
    }
  });
});

// @route  Get api/vocab
// @desc   get all vocab
// @access Public
router.get("/", (req, res) => {
  db.getDB()
    .collection(collection)
    .find({})
    .toArray((err, documents) => {
      if (err) {
        console.log(err);
      } else {
        res.json(documents);
      }
    });
});
// @route  Get api/Vocab/:id
// @desc   get a vocab based on id
// @access Public
router.get("/:id", (req, res) => {
  const vocabID = req.params.id;

  db.getDB()
    .collection(collection)
    .find({ _id: db.getPrimaryKey(vocabID) })
    .toArray((err, documents) => {
      if (err) {
        console.log(err);
      } else {
        res.json(documents);
      }
    });
});

// @route  Get api/getVocab/:word
// @desc   get a vocab based on a word
// @access Public
router.get("/getVocab/:word", (req, res) => {
  const word = req.params.word;
  db.getDB()
    .collection(collection)
    .find({ word: word })
    .toArray((err, documents) => {
      if (err) {
        console.log(err);
      } else {
        res.json(documents);
      }
    });
});

// @route  DELETE api/vocab/:id
// @desc   Delete a vocab
// @access Public
router.delete("/:id", (req, res) => {
  const vocabID = req.params.id;

  db.getDB()
    .collection(collection)
    .findOneAndDelete({ _id: db.getPrimaryKey(vocabID) }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
});


module.exports = router;
