(function () {
  'use strict';
  var libDir = '../../../../generators/app/lib';

  var gitignore = require(libDir + '/component/gitignore');
  var projectBuilder = require(libDir + '/project_builder');
  var mocks = require('../../../helpers/mocks');
  var mockGenerator;

  describe('generator-openstack:lib/component/gitignore', function () {

    beforeEach(function () {
      mockGenerator = mocks.buildGenerator();
      projectBuilder.clear();
    });

    it('should define init, prompt, and configure',
      function () {
        expect(typeof gitignore.init).toBe('function');
        expect(typeof gitignore.prompt).toBe('function');
        expect(typeof gitignore.configure).toBe('function');
      });

    describe('init()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = gitignore.init(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should do nothing',
        function () {
          var spy = spyOn(mockGenerator.config, 'defaults');
          gitignore.init(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('prompt()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = gitignore.prompt(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should do nothing',
        function () {
          var spy = spyOn(mockGenerator, 'prompt');
          gitignore.prompt(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('configure()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = gitignore.configure(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should add gitignore to the project files.',
        function () {
          gitignore.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          expect(files.length).toBe(1);
          expect(files[0].from).toBe('.gitignore');
          expect(files[0].to).toBe('.gitignore');
        });
    });
  });
})();
