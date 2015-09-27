/**
 * we're working with the 'mongodb' driver
 *
 * documentation is at
 *
 *   http://mongodb.github.io/node-mongodb-native/2.0
 *
 */
'use strict';
var mongodb = require("mongodb");
var ObjectID = require('mongodb').ObjectID; 

// this is where we'll cache our db connection
var db;


exports.join = function(data, cb) {
  // http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#find
  getDb(function(err, db) {
    if(err) {
      return cb(err);
    }

    db.collection('players')
    .insertOne(data, function(err, result) {
      if(err) {
        return cb(err);
      }

      if(result.insertedCount === 1) {
        cb(null, result.ops[0]);
      } else {
        cb(new Error("not-inserted"));
      }
    });
  });
}

exports.getPlayer = function(id, cb) {
  getDb(function(err, db) {
    if(err) {
      return cb(err);
    }

    db.collection('players')
    .findOne({
      _id: ObjectID(id),
    }, cb);
  });
}

exports.chat = function(id, chatData, cb) {
  
  getDb(function(err, db) {
    if(err) {
      return cb(err);
    }

    // TODO update the player object's `.chats` array
    // TODO make sure you use a method that *modifies* the array, not overwrites it
    // player will look like { chats: [ { text: "some text" }, ... ] }
    db.collection('players')
    .update({
      _id: ObjectID(id),
    }, {
      $push: {
        chats: chatData,
      },
    }, function(err) {
      if(err) {
        cb(err);
      } else {
        cb(null, chatData);
      }
    });
  })
}



/*
 * this method retrieves the current db connection - you don't need to 
 * modify it
 */
function getDb(cb) {
  if(db) {
    return cb(null, db);
  }

  var url = 'mongodb://localhost:27017/demo';
  mongodb.MongoClient.connect(url, function(err, _db) {
    if(err) {
      cb(err);
    } else {
      db = _db;
      cb(null, db);
    }
  });
}
