/* jshint node: true */
'use strict';

var RestAdapter = require('./lib/rest-adapter');

module.exports = {
  name: 'ember-deploy-rest-index',
  type: 'ember-deploy-addon',

  adapters: {
    index: {
      'REST': RestAdapter
    }
  }
};
