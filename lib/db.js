'use strict';

var db = {
  store: {}
};

db.addStore = function (name, config) {
  if (!config || !config.reset) {
    throw new Error('config.reset must be set when adding a DB');
  }

  db.store[name] = config;

  return db.store[name];
};

db.reset = function (key) {
  if (key) {
    return db.store[key].reset();
  }

  for (key in db.store) {
    db.store[key].reset();
  }
};

module.exports = db;