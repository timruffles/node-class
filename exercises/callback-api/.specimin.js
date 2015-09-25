exports.safeSquare = function(n, cb) {
  if(isNaN(n)) {
    cb(new Error("not a number!"));
  } else {
    cb(null, n * n);
  }
}

exports.timeExecution = function(runMe, cb) {
  var start = +new Date;

  runMe(function(err, value) {
    var time = new Date - start;
    if(err) {
      cb(err, null, time);
    } else {
      cb(null, value, time);
    }
  });
}
