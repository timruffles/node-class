module.exports = Grid;

function Grid(w,h) {
  this._byX = [];

  for(var x = 0; x < w; x++) {
    this._byX[x] = [];
  }
}

Grid.prototype = {
  add: function(positioned) {
    this.put(positioned.x, positioned.y, positioned);
  },
  get: function(x, y) {
    if(typeof x === "object") {
      return this.get(x.x, x.y);
    }
    return this._byX[x][y];
  },
  move: function(positioned, to) {
    if(this.get(positioned) === positioned) {
      this.put(positioned, null);
    }
    this.put(to, positioned);
  },
  put: function(x, y, item) {
    if(typeof x === "object") {
      return this.put(x.x, x.y, y);
    }
    this._byX[x][y] = item;
  },
}

