const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const dbName = require("../config/keys").DbName;
const dbURL = require("../config/keys").mongoURI;
const mongoOptions = { useNewUrlParser: true };

const state = {
  db: null
};

const connect = cb => {
  if (state.db) {
    cb();
  } else {
    MongoClient.connect(dbURL, mongoOptions, (err, client) => {
      if (err) {
        cb(err);
      } else {
        state.db = client.db(dbName);
        cb();
      }
    });
  }
};

const getPrimaryKey = _id => {
  return ObjectID(_id);
};

const getDB = () => {
  return state.db;
};

module.exports = { getDB, connect, getPrimaryKey };
