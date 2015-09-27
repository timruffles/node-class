
function a() {
  // as if b was declared & defined here = function declaration hoisting

  b();
  console.log(typeof c); // undefined
  c(); // undefined is not a function
  d() // variable d is not declared

  var c = function() {
    console.log("hi");
  }

  
  return;

  function b() {
    
  }
}
