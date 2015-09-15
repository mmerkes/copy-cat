'use strict';

var chai = require('chai'),
    expect = chai.expect,
    db = require('../lib/db');

describe('UNIT db.js', function () {
  describe('addStore(name, config)', function () {
    it('should throw an error if config is not set', function () {
      expect(function () {
        db.addStore('name');
      }).to.throw(Error);
    });

    it('should throw an error if config.reset is not set', function () {
      expect(function () {
        db.addStore('name', {});
      }).to.throw(Error);
    });

    it('should add a db to db.store and return the stored object', function () {
      var config = {
        reset: function () {}
      };
      var test1store = db.addStore('test-1', config);
      expect(db.store).to.have.property('test-1').that.equals(test1store)
        .and.has.property('reset').that.equals(config.reset);
    });
  });

  describe('reset(key)', function () {
    var test2store, test3store;

    before( function () {
      test2store = db.addStore('test-2', {
        count: 0,
        reset: function () {
          this.count = 0;
        }
      });
      expect(db.store).to.have.property('test-2').that.equals(test2store);
      test3store = db.addStore('test-3', {
        dollars: 0,
        reset: function () {
          this.dollars = 0;
        }
      });
      expect(db.store).to.have.property('test-3').that.equals(test3store);
    });

    it('should allow reseting one store by key when key is set', function () {
      test2store.count = 1;
      expect(test2store).to.have.property('count').that.equals(1);
      db.reset('test-2');
      expect(test2store).to.have.property('count').that.equals(0);
    });

    it('should call reset() on all keys in the store when key is undefined', function () {
      test2store.count = 1;
      test3store.dollars = 100;
      expect(test2store).to.have.property('count').that.equals(1);
      expect(test3store).to.have.property('dollars').that.equals(100);
      db.reset();
      expect(test2store).to.have.property('count').that.equals(0);
      expect(test3store).to.have.property('dollars').that.equals(0);
    });
  });
});