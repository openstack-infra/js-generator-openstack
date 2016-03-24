(function () {
  'use strict';
  var libDir = '../../../../generators/app/lib';

  var gerrit = require(libDir + '/component/gerrit');
  var projectBuilder = require(libDir + '/project_builder');
  var mocks = require('../../../helpers/mocks');
  var mockGenerator;

  var expectedDefaults = {
    enableGerrit: true,
    gerritHost: 'review.openstack.org',
    gerritPort: 29418,
    gerritProject: 'openstack/generator-openstack.git'
  };

  describe('generator-openstack:lib/component/gerrit', function () {

    beforeEach(function () {
      mockGenerator = mocks.buildGenerator();
      projectBuilder.clear();
    });

    it('should define init, prompt, and configure',
      function () {
        expect(typeof gerrit.init).toBe('function');
        expect(typeof gerrit.prompt).toBe('function');
        expect(typeof gerrit.configure).toBe('function');
      });

    describe('init()', function () {
      it('should set defaults',
        function () {
          var spy = spyOn(mockGenerator.config, 'defaults');
          gerrit.init(mockGenerator);
          expect(spy.calls.any()).toBeTruthy();
          expect(spy.calls.first().args[0]).toEqual(expectedDefaults);
        });
    });

    describe('prompt()', function () {
      //it('should invoke a prompt',
      //  function () {
      //    var generator = mocks.buildGenerator();
      //
      //    var spy = spyOn(generator, 'prompt').and.callThrough();
      //    gerrit.prompt(generator);
      //
      //    expect(spy.calls.any()).toBeTruthy();
      //  });

      it('should revert to defaults if no answers provided',
        function () {
          var config = {};
          var mockAnswers = {};
          var generator = mocks.buildGenerator(config, mockAnswers);

          // Set defaults
          gerrit.init(generator);

          // Call the generator
          gerrit.prompt(generator);
          expect(config).toEqual(expectedDefaults);
        });

      it('should configure answers if answers provided',
        function () {
          var config = {};
          var mockAnswers = {
            enableGerrit: true,
            gerritHost: 'review.example.org',
            gerritPort: 1000,
            gerritProject: 'openstack/test.git'
          };
          var generator = mocks.buildGenerator(config, mockAnswers);

          // Set defaults
          gerrit.init(generator);

          // Call the generator
          gerrit.prompt(generator);
          expect(config).toEqual(mockAnswers);
        });

      it('should only check options if gerritEnabled is true',
        function () {
          var config = {};
          var mockAnswers = {
            enableGerrit: false
          };
          var generator = mocks.buildGenerator(config, mockAnswers);

          // Set defaults
          gerrit.init(generator);

          // Call the generator
          gerrit.prompt(generator);
          expect(config).toEqual(mockAnswers);

        });
    });

    describe('configure()', function () {
      it('should create a .gitreview file if enabled',
        function () {
          var mockConfig = {enableGerrit: true};
          var generator = mocks.buildGenerator(mockConfig);
          gerrit.configure(generator);

          var includedFiles = projectBuilder.getIncludedFiles();
          expect(includedFiles.length).toBe(1);
          expect(includedFiles[0].from).toBe('.gitreview');
          expect(includedFiles[0].to).toBe('.gitreview');

          var excludedFiles = projectBuilder.getExcludedFiles();
          expect(excludedFiles.length).toBe(0);
        });

      it('should delete a .gitreview file if disabled',
        function () {
          var mockConfig = {enableGerrit: false};
          var generator = mocks.buildGenerator(mockConfig);
          gerrit.configure(generator);

          var includedFiles = projectBuilder.getIncludedFiles();
          expect(includedFiles.length).toBe(0);

          var excludedFiles = projectBuilder.getExcludedFiles();
          expect(excludedFiles.length).toBe(1);
          expect(excludedFiles[0]).toBe('.gitreview');
        });
    });
  });
})();
