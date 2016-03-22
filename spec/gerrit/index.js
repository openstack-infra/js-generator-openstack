(function () {
  'use strict';
  var path = require('path');
  var assert = require('yeoman-assert');
  var helpers = require('yeoman-generator').test;

  var generator = path.join(__dirname, '../../generators/gerrit');

  describe('generator-openstack:gerrit', function () {

    describe('prompt enableGerrit:false', function () {
      beforeEach(function (done) {
        helpers.run(generator)
          .withPrompts({enableGerrit: false})
          .on('end', done);
      });

      it('should not create a .gitreview file', function () {
        assert.noFile('.gitreview');
      });
    });

    describe('prompt enableGerrit:true with defaults', function () {
      beforeEach(function (done) {
        helpers.run(generator)
          .withPrompts({
            enableGerrit: true
          })
          .on('end', done);
      });

      it('should create a .gitreview file', function () {
        assert.fileContent('.gitreview', 'host=review.openstack.org');
        assert.fileContent('.gitreview', 'port=29418');
        assert.fileContent('.gitreview', 'project=openstack/your_project.git');
      });
    });

    describe('prompt enableGerrit:true with settings', function () {
      beforeEach(function (done) {
        helpers.run(generator)
          .withPrompts({
            enableGerrit: true,
            gerritHost: 'host.example.com',
            gerritPort: 1000,
            gerritProject: 'openstack/test_project.git'
          })
          .on('end', done);
      });

      it('should create a .gitreview file', function () {
        assert.fileContent('.gitreview', 'host=host.example.com');
        assert.fileContent('.gitreview', 'port=1000');
        assert.fileContent('.gitreview', 'project=openstack/test_project.git');
      });
    });

    describe('config enableGerrit:false', function () {
      beforeEach(function (done) {
        helpers.run(generator)
          .withLocalConfig({enableGerrit: false})
          .on('end', done);
      });

      it('should not create a .gitreview file', function () {
        assert.noFile('.gitreview');
      });
    });

    describe('config enableGerrit:true with defaults', function () {
      beforeEach(function (done) {
        helpers.run(generator)
          .withLocalConfig({enableGerrit: true})
          .on('end', done);
      });

      it('should create a .gitreview file', function () {
        assert.fileContent('.gitreview', 'host=review.openstack.org');
        assert.fileContent('.gitreview', 'port=29418');
        assert.fileContent('.gitreview', 'project=openstack/your_project.git');
      });
    });

    describe('prompt enableGerrit:true with settings', function () {
      beforeEach(function (done) {
        helpers.run(generator)
          .withLocalConfig({enableGerrit: true})
          .withPrompts({
            gerritHost: 'host.example.com',
            gerritPort: 1000,
            gerritProject: 'openstack/test_project.git'
          })
          .on('end', done);
      });

      it('should create a .gitreview file', function () {
        assert.fileContent('.gitreview', 'host=host.example.com');
        assert.fileContent('.gitreview', 'port=1000');
        assert.fileContent('.gitreview', 'project=openstack/test_project.git');
      });
    });

    describe('nonInteractive', function () {
      beforeEach(function (done) {
        helpers.run(generator)
          .withOptions({'non-interactive': true})
          .withLocalConfig({
            enableGerrit: true,
            gerritHost: 'test1.example.com',
            gerritPort: 1000,
            gerritProject: 'openstack/test_project_1.git'
          })
          .withPrompts({
            enableGerrit: false,
            gerritHost: 'test2.example.com',
            gerritPort: 1001,
            gerritProject: 'openstack/test_project_2.git'
          })
          .on('end', done);
      });

      it('should create a .gitreview file with local config values',
        function () {
          assert.fileContent('.gitreview', 'host=test1.example.com');
          assert.fileContent('.gitreview', 'port=1000');
          assert.fileContent('.gitreview',
            'project=openstack/test_project_1.git');
        });
    });
  });
})();
