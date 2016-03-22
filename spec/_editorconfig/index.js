(function () {
  'use strict';
  var path = require('path');
  var assert = require('yeoman-assert');
  var helpers = require('yeoman-generator').test;

  var generator = path.join(__dirname, '../../generators/_editorconfig');

  describe('generator-openstack:_editorconfig', function () {

    beforeEach(function (done) {
      helpers.run(generator)
        .on('end', done);
    });

    it('should create a .editorconfig file', function () {
      assert.file('.editorconfig');
    });
  });
})();
