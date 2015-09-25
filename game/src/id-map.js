module.exports = IdMap;
var _ = require("lodash");

function IdMap(enumerable) {
  this._byId = {};
  _.each(enumerable || [], function(v) {
    this.add(v);
  }, this);
}

IdMap.prototype = {
  get: function(k) {
    return this._byId[k];
  },
  add: function(item) {
    this._byId[item.id] = item;
  },
  get members() {
    var all = [];
    for(var p in this._byId) {
      all.push(this._byId[p]);
    }
    return all;
  },
  remove: function(item) {
    delete this._byId[item.id];
  },
};
