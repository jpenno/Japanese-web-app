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

module.exports = router;
