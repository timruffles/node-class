exports.callMeLater = function(callback) {
  setTimeout(function() {
    callback(null, "hello");
  }, 500)
}

exports.createMultipler = function(n) {
  return function(m) { return n * m };
}

exports.callMeN = function(fn, n) {
  return function() {
    while(n--) fn();
  }
}
