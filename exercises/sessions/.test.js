var help = require("../.sys/test-help");
var supertest = require("supertest");

describe("using sessions", function() {

    help.importAndTest(__dirname, function(exported) {

      before(function(done) {
        request = supertest("0.0.0.0:4481");
        exported.listen(4481, function() {
          done();
        });
      });

      it("lets me register a note", function(done) {
        request
        .post("/note")
        .send({ text: "hello" })
        .expect(200)
        .end(done);
      });

      it("lets me retrieve a note", function(done) {
        var cookies;

        var string = help.rstring();

        request
        .post("/note")
        .send({ text: string })
        .expect(200)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          cookies = res.headers['set-cookie'].pop().split(';')[0];

          var get = request
          .get("/note");

          get.cookies = cookies;

          get
          .expect(200)
          .expect({ text: string })
          .end(done);

        });
      });

    });


});
