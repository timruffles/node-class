// here is the function to test
var outOfBounds = require("./exercise").outOfBounds;

// our specification for outOfBounds is
//
// outOfBounds(x, y, width, height)
//
// returns true if 
//   0 <= x < width
//         AND
//   0 <= y < height

describe("the outOfBounds function", function() {

  it("prevents players leaving the top", function() {
    // TODO stop players reaching { y: < 0 }
  });

  it("prevents players leaving the left", function() {
    // TODO stop players reaching { x: < 0 }
  });

  it("prevents players leaving the right", function() {
    // TODO stop players reaching { x: >= width }
  });

  it("prevents players leaving the bottom", function() {
    // TODO stop players reaching { y: >= height }
  });

  it("allows spaces within bounds", function() {
    // TODO allow players to reach spots within bounds
  });

  // TODO bonus
  //
  // these tests look repetitive, perhaps you could
  // think of a way of cleaning it up?
  // - keep readability of tests
  // - keep it so one test can fail alone

});

