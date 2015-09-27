exports.callMeLater = function(callback) {
  setTimeout(callback, 500);
}

exports.createMultipler = function(n) {
  // TODO return a function that takes a single numeric
  // arguments and multiplies it by n

  return function(m) {
    return n * m; 
  }
}

exports.callMeN = function(fn, n) {
  // TODO return a function that calls the original
  // function `n` times
  return function() {
    while(n--) fn(); 
  }
}
