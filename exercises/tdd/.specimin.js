exports.outOfBounds = function outOfBounds(x,y,w,h) {
  return x < 0 || x >= w ||
    y < 0 || y >= h;
}
