'use strict';

var server = require('../index.js');
var expect = require('chai').expect;
var request = require('supertest')('http://localhost:3000');

// allow 500ms for each test to complete, todo - make this better with a callback.
  beforeEach(function (done) {
    setTimeout(function(){
      done();
    }, 500);
  });

describe('Bets array challenge', function() {
  it('should get empty bets array', function(done) {
    request.
    get('/bets').
    expect(200, [], done);
  });

  it('should add a bet', function(done) {
    request.
    post('/bets').
    send({"bet_id":3,"odds":{"numerator":3,"denominator":1},"stake":1000}).
    expect(201, done);
  });

  it('should verify only one bet exists', function(done) {
    request.
    get('/bets').
    expect(200).
    end(function(err, response) {
      if (err) {
        throw err;
      }

      expect(response.body).to.be.instanceof(Array);
      expect(response.body).to.have.length(1);
      expect(response.body[0].bet_id).to.be.an('number');
      expect(response.body[0].stake).to.be.an('number');
      done();
    });
  });

  it('should add a second bet', function(done) {
    request.
    post('/bets').
    send({"bet_id":4,"odds":{"numerator":4,"denominator":1},"stake":500}).
    expect(201, done);
  });

  it('should verify two bets exist', function(done) {
    request.
    get('/bets').
    expect(200).
    end(function(err, response) {
      if (err) {
        throw err;
      }

      expect(response.body).to.be.instanceof(Array);
      expect(response.body).to.have.length(2);

      expect(response.body[0].bet_id).to.be.an('number');
      expect(response.body[0].stake).to.be.an('number');

      expect(response.body[1].bet_id).to.be.an('number');
      expect(response.body[1].stake).to.be.an('number');

      done();
    });
  });



  it('should delete the second bet', function(done) {
    request.
    delete('/bets/1').
    expect(204, done);
  });

  it('should verify that delete is working correctly', function(done) {
    request.
    get('/bets').
    expect(200).
    end(function(err, response) {
      if (err) {
        throw err;
      }

      expect(response.body).to.be.instanceof(Array);
      expect(response.body).to.have.length(1);

      expect(response.body[0].bet_id).to.be.an('number');
      expect(response.body[0].stake).to.be.an('number');

      done();
    });
  });

  it('should get err 400 when trying to add bet using bad params', function(done) {
    request.
    post('/bets').
    send({
      foo: 'bar',
      baz: 'bop'
    }).
    expect(400, done);
  });

  it('should fail deleting a non-exitent bet', function(done) {
    request.
    delete('/bets/20').
    expect(404, done);
  });
});
