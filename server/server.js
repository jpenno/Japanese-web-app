const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");


//const db = require("./db");
const collection = "todo";
const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../", "public")));

const start = () =>{
  app.listen(3000, () => {
    console.log("connected to database, app listening on port 3000");
    console.log(__dirname);
  });
}

start();