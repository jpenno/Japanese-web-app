const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const db = require("./db");
const collection = require("../config/keys").Collection;
const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../", "public")));

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
