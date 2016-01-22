// TODO safeSquare should validate 'n' is a number.
// - if it is, provide that value via cb following the standard nodejs callback API
// - if it isn't, indicate an error via cb following the standard nodejs callback API
//
// function cb(err, squaredNumber)
exports.safeSquare = function(n, cb) {
  // TODO validate n
  // TODO pass on error
  // TODO pass on result
}


// TODO timeExecution takes a function to run, and a callback
// Call runMe passing a function with the standard nodejs callbackAPI
// - if runMe errors, pass on the error to cb
// - if runMe succeeds, pass on the value along with a third argument giving the execution time
exports.timeExecution = function(runMe, cb) {
  var start = +new Date;

  runMe(function(err, value) {
    var time = new Date - start;
    // TODO pass on result
  });
}
