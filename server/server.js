const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const db = require("./db");
const collection = require("../config/keys").Collection;
const app = express();
app.use(bodyParser.json());

const items = require('../api/kanji');
// Use Routes
app.use('/kanji', items);

app.use(express.static(path.join(__dirname, "../", "public")));

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
