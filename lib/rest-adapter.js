/* jshint node: true */
'use strict';
var CoreObject = require('core-object');
var Client = require('node-rest-client').Client;
var Promise = require('ember-cli/lib/ext/promise');
var chalk = require('chalk');

var green = chalk.green;
var red = chalk.red;

var DEFAULT_MANIFEST_SIZE = 10;

module.exports = CoreObject.extend({
  init: function(options) {
    this._super(options);

    this.manifestSize = this.manifestSize || DEFAULT_MANIFEST_SIZE;

    //TODO: throw if no service host
    this.serviceHost = this.config.serviceHost;
    this.serviceNamespace = this.config.serviceNamespace;
    this.serviceIndexVersionResource = this.config.serviceIndexVersionResource;

    this.client = new Client({
      mimetypes: {
        json:["application/json","application/json; charset=utf-8"]
      }
    });
  },

  upload: function(buffer) {
    var key = this.taggingAdapter.createTag();
    var indexHtml = buffer.toString('utf8');
    return this._upload(key, indexHtml)
      .then(function() {
        this._writeLineInGreen("Your revision '" + key + "' was uploaded");
      }.bind(this))
      .catch(function(err) {
        this._writeLineInRed(err);
      }.bind(this));
  },

  list: function() {
    return this._list()
      .then(function(data) {
        this._writeLineInGreen("Your revisions: ");
        this._writeRevisions(data);
      }.bind(this))
      .catch(function(err) {
        this._writeLineInRed(err);
      }.bind(this));
  },

  activate: function(revision) {
    return this._activate(revision)
      .then(function(data) {
        this._writeLineInGreen(data);
      }.bind(this))
      .catch(function(err) {
        this._writeLineInRed(err);
      }.bind(this));

  },

  _upload: function(key, indexHtml) {
    return new Promise(function(resolve, reject) {
      var path = this._buildPath();

      this._writeLineInGreen("POST '" + path + "' to add revision");
      this._writeEmptyLine();

      var args = {
        headers:{"Content-Type": "application/json"},
        data: {
          id: key,
          indexHtml: indexHtml
        }
      };

      this.client.post(path, args, function(data, response) {
        if (response.statusCode === 200) {
          resolve(data);
        } else {
          reject(data);
        }
      }.bind(''));

    }.bind(this));
  },

  _list: function() {
    return new Promise(function(resolve, reject) {
      var path = this._buildPath();

      this._writeLineInGreen("GET '" + path + "' to get revisions");
      this._writeEmptyLine();

      this.client.get(path, function(data, response) {
        if (response.statusCode === 200) {
          resolve(data);
        }
        else {
          reject(data);
        }
      }.bind(this));

    }.bind(this));
  },

  _activate: function(revision) {
    return new Promise(function(resolve, reject) {
      var path = this._buildPath() + '/' + encodeURIComponent(revision);

      this._writeLineInGreen("PUT '" + path + "' to activate revision");
      this._writeEmptyLine();

      var args = {
        headers:{"Content-Type": "application/json"}
      };

      this.client.put(path, args, function(data, response) {
        if (response.statusCode === 200) {
          resolve(data);
        }
        else {
          reject(data);
        }
      }.bind(this));
    }.bind(this));
  },

  _writeRevisions: function(revisions) {
    revisions.forEach(function(r, i) {
      var counter = i + 1;
      var message = counter + ". " + r;
      this._writeLineInGreen(message);
    }.bind(this));

    this._writeEmptyLine();
    this._writeLineInGreen("Run deploy:activate to set one of your revisions as current");
  },

  _writeLineInGreen: function(message) {
    this.ui.writeLine(green(message));
  },

  _writeLineInRed: function(message) {
    this.ui.writeLine(red(message));
  },

  _writeEmptyLine: function() {
    this.ui.writeLine('');
  },

  _buildPath: function() {
    return this.serviceHost + '/' + this.serviceNamespace + '/' + this.serviceIndexVersionResource;
  }
});
