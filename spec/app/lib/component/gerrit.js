(function () {
  'use strict';
  var libDir = '../../../../generators/app/lib';

  var ini = require('ini');

  var gerrit = require(libDir + '/component/gerrit');
  var projectBuilder = require(libDir + '/project_builder');
  var mocks = require('../../../helpers/mocks');

  var expectedConfigDefaults = {
    enableGerrit: true
  };
  var iniFile = {
    gerrit: {
      host: 'review.example.org',
      port: '1000',
      project: 'openstack/test-project.git'
    }
  };

  /**
   * Assert that the gerrit file content matches the passed structure.
   *
   * @param {object} content The expected data structure.
   * @returns {void}
   */
  function expectGerritFileContent (content) {
    var files = projectBuilder.getIncludedFiles();

    // get the .gitreview file
    var gitreview = null;
    files.forEach(function (fileRef) {
      if (fileRef.to === '.gitreview') {
        gitreview = ini.parse(fileRef.content());
      }
    });

    // Test the content
    expect(gitreview).toBeTruthy();
    expect(content).toEqual(gitreview);
  }

  describe('generator-openstack:lib/component/gerrit', function () {

    beforeEach(function () {
      projectBuilder.clear();
    });

    it('should define init, prompt, and configure',
      function () {
        expect(typeof gerrit.init).toBe('function');
        expect(typeof gerrit.prompt).toBe('function');
        expect(typeof gerrit.configure).toBe('function');
      });

    describe('init()', function () {
      it('should return a generator',
        function () {
          var generator = mocks.buildGenerator();
          var outputGenerator = gerrit.init(generator);
          expect(outputGenerator).toEqual(generator);
        });

      it('should set defaults',
        function () {
          var generator = mocks.buildGenerator();
          var spy = spyOn(generator.config, 'defaults');
          gerrit.init(generator);
          expect(spy.calls.any()).toBeTruthy();
          expect(spy.calls.first().args[0]).toEqual(expectedConfigDefaults);
        });

      it('should revert to defaults if no answers provided',
        function () {
          var config = {};
          var mockAnswers = {};
          var generator = mocks.buildGenerator(config, mockAnswers);

          // Set defaults
          gerrit.init(generator);

          // Call the generator
          gerrit.prompt(generator);
          expect(config).toEqual(expectedConfigDefaults);
        });

      it('should read default values from an existing .gitreview file.',
        function () {
          var generator = mocks.buildGenerator();

          generator.fs.write('.gitreview', ini.stringify(iniFile));
          gerrit.init(generator);
          gerrit.configure(generator);

          expectGerritFileContent(iniFile);
        });
    });

    describe('prompt()', function () {
      it('should return a promise that resovles with a generator',
        function () {
          var generator = mocks.buildGenerator();
          var outputPromise = gerrit.prompt(generator);
          outputPromise.then(function (outputGenerator) {
            expect(outputGenerator).toEqual(generator);
          });
        });

      it('should revert to config defaults if no answers provided',
        function () {
          var config = {};
          var mockAnswers = {};
          var generator = mocks.buildGenerator(config, mockAnswers);

          // Set defaults
          gerrit.init(generator);

          // Call the generator
          gerrit.prompt(generator);
          expect(config).toEqual(expectedConfigDefaults);
        });

      it('should not show a prompt if non-interactive is set',
        function () {
          var generator = mocks.buildGenerator(null, null,
            {'non-interactive': true});
          var promptSpy = spyOn(generator, 'prompt');

          generator.fs.write('.gitreview', ini.stringify(iniFile));

          gerrit.init(generator);
          gerrit.prompt(generator);

          expect(promptSpy.calls.any()).toBeFalsy();
        });

      it('should use defaults in .gitreview if no answers provided',
        function () {
          var generator = mocks.buildGenerator();

          generator.fs.write('.gitreview', ini.stringify(iniFile));
          gerrit.init(generator);
          gerrit.configure(generator);

          expectGerritFileContent(iniFile);
        });

      it('should configure answers if answers provided',
        function () {
          var config = {};
          var mockAnswers = {
            enableGerrit: true,
            gerritHost: 'review.example.org',
            gerritPort: '1000',
            gerritProject: 'openstack/test.git'
          };
          var generator = mocks.buildGenerator(config, mockAnswers);

          // Set defaults
          gerrit.init(generator);
          gerrit.prompt(generator);
          gerrit.configure(generator);

          expectGerritFileContent({
            gerrit: {
              host: mockAnswers.gerritHost,
              port: mockAnswers.gerritPort,
              project: mockAnswers.gerritProject
            }
          });
        });
    });

    describe('configure()', function () {
      it('should return a generator',
        function () {
          var generator = mocks.buildGenerator();
          var outputGenerator = gerrit.init(generator);
          expect(outputGenerator).toEqual(generator);
        });

      it('should create a .gitreview file if enabled',
        function () {
          var mockConfig = {enableGerrit: true};
          var generator = mocks.buildGenerator(mockConfig);

          // Make sure we don't have something left over from another test.
          generator.fs.delete('.gitreview');

          gerrit.init(generator);
          gerrit.configure(generator);

          expectGerritFileContent({
            gerrit: {
              host: 'review.openstack.org',
              port: '29418',
              project: 'openstack/generator-openstack.git'
            }
          });

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
