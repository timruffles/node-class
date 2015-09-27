// start in the start-here folder to write tests.
// once you have failing tests, write code in here to make them pass
//
exports.outOfBounds = function outOfBounds(x, y, w, h) {
  return !(x > 0 && x <= w && y > 0 && y <= h);
}
 

