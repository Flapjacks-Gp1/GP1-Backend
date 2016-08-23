var app = require('../app');
var supertest = require('supertest');

describe("Express Server API", function() {
  it("returns status code 200", function(done) {
    supertest(app)
      .post('/api/login', {email: "jon@gmail.com", password:"password123"})
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

// describe("test spec", function() {
//   it("returns true", function(done) {
//
//     supertest(app)
//       .get('/api/users')
//       .expect('Content-Type', /json/)
//       .expect(200, done);
//   });
// });
