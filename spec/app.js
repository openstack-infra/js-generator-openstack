(function () {
  'use strict';
  var path = require('path');
  var assert = require('yeoman-assert');
  var helpers = require('yeoman-generator').test;

  var generator = path.join(__dirname, '../generators/app');
  var composedGenerators = [
    [helpers.createDummyGenerator(), 'openstack:editorconfig'],
    [helpers.createDummyGenerator(), 'openstack:gerrit'],
    [helpers.createDummyGenerator(), 'openstack:license']
  ];

  describe('generator-openstack:app', function () {
    beforeEach(function (done) {
      helpers.run(generator)
        .withGenerators(composedGenerators)
        .withOptions({someOption: true})
        .withPrompts({someAnswer: true})
        .on('end', done);
    });

    it('creates files', function () {
      assert.file([
        'dummyfile.txt'
      ]);
    });
  });
})();
