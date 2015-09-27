// here is the function to test
var outOfBounds = require("./exercise").outOfBounds;

// our specification for outOfBounds is
//
// outOfBounds(x, y, width, height)
//
// returns true if 
//   0 > x || x > width
//         AND
//   0 > y || y > height

describe("the outOfBounds function", function() {

  it("prevents players leaving the top", function() {
    // TODO stop players reaching { y: < 0 }
    assert.isOutOfBounds(0, -100, 50, 50);
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
    var result = outOfBounds(25, 25, 50, 50);
    assert.equal(result, false);
  });

  // TODO bonus
  //
  // these tests look repetitive, perhaps you could
  // think of a way of cleaning it up?
  // - keep readability of tests
  // - keep it so one test can fail alone

});

