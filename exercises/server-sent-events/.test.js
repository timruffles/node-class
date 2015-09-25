var help = require("../.sys/test-help");
var http = require("http");
var request = require("superagent");
var concat = require("concat-stream");

describe("server-sent-events", function() {

  this.timeout(500);

    help.importAndTest(__dirname, function(exported) {

      var server;

      afterEach(function(done) {
        server.close(done);
      });

      it("sends headers", function(done) {
        server = http.createServer(function(req, res) {
          exported.start(res);
        });

        server.listen(4422, function() {

          bufferRequest(function(req, res) {
            req.abort();
            assert.property(res.headers, "content-type")
            assert.equal(res.headers["content-type"],'text/event-stream');
            done();
          });

        });

          
      });

      it("sends events with data", function(done) {
        server = http.createServer(function(req, res) {
          exported.start(res);
          var string = help.rstring();
          var dataString = help.rstring();
          exported(res, string, { something: dataString });
          res.end();
        });

        var buf = "";

        server.listen(4422, function() {

          bufferRequest(function(_req, res) {
            res.on("error", done);
            res.pipe(concat(function(all) {

              var lines = all.toString().split("\n");
              var event = findRegex(lines, /^event/);
              var data = findRegex(lines, /^data/);

              assert(event, "found event line");

              assert(data, "found data line");
              var json = data.replace(/^data: /, "");
              try {
                JSON.parse(json);
              } catch(e) {
                assert(false, "Could not parse data, '" + json + "'");
              }

              done();
            }));
          });

        });

          
      });



    });


});

function bufferRequest(callback) {
 var req = http.request({
    hostname: 'localhost',
    port: 4422,
    path: '/events',
    method: 'GET'
  }, function(res) {
    callback(req,res);
  });
  req.end();
}

function findRegex(coll, regex) {
  for(var i = 0; i < coll.length; i++) {
    if(regex.test(coll[i])) {
      return coll[i];
    }
  }
}
