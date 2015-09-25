'use strict';
var mongodb = require("mongodb");
var ObjectID = require('mongodb').ObjectID; 

var db;

exports.chat = function(id, chatData, cb) {
  
  getDb(function(err, db) {
    if(err) {
      return cb(err);
    }

    db.collection('players')
    .update({
      _id: ObjectID(id),
    }, {
      $push: {
        chats: chatData,
      },
    }, function(err) {
      if(err) {
        return cb(err);
      }

      cb(null, chatData);
    });
  })
}

exports.join = function(data, cb) {
  getDb(function(err, db) {
    if(err) {
      return cb(err);
    }

    db.collection('players')
    .insertOne(data, function(err, result) {
      if(err) {
        return cb(err);
      }
      
      if(result.insertedCount !== 1) {
        return cb(new Error("not-inserted"));
      }

      cb(null, result.ops[0]);
    })
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
    }, function(err, player) {
      if(err || !player) {
        cb(err || new Error("not-found"));
      } else {
        cb(null, player);
      }
    });
  });
}




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
