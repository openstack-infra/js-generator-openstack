(function () {
  'use strict';
  var path = require('path');
  var assert = require('yeoman-assert');
  var helpers = require('yeoman-generator').test;

  var generator = path.join(__dirname, '../../generators/_license');

  describe('generator-openstack:license', function () {

    beforeEach(function (done) {
      helpers.run(generator)
        .on('end', done);
    });

    it('should create a LICENSE file', function () {
      assert.file('LICENSE');
    });
  });
})();
