
// this is a stubbed version of a backend call to retrieve
// a player.
exports.getPlayer = function(id, cb) {
  // if we have an ID we just return a player
  if(id != null) {
    cb(null, { name: "bob" });
  // otherwise we throw an error
  } else {
    cb(new Error("unknown"));
  }
}
