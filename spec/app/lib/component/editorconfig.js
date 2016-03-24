(function () {
  'use strict';
  var libDir = '../../../../generators/app/lib';

  var editorconfig = require(libDir + '/component/editorconfig');
  var projectBuilder = require(libDir + '/project_builder');
  var mocks = require('../../../helpers/mocks');
  var mockGenerator;

  describe('generator-openstack:lib/component/editorconfig', function () {

    beforeEach(function () {
      mockGenerator = mocks.buildGenerator();
      projectBuilder.clear();
    });

    it('should define init, prompt, and configure',
      function () {
        expect(typeof editorconfig.init).toBe('function');
        expect(typeof editorconfig.prompt).toBe('function');
        expect(typeof editorconfig.configure).toBe('function');
      });

    describe('init()', function () {
      it('should do nothing',
        function () {
          var spy = spyOn(mockGenerator.config, 'defaults');
          editorconfig.init(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('prompt()', function () {
      it('should do nothing',
        function () {
          var spy = spyOn(mockGenerator, 'prompt');
          editorconfig.prompt(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('configure()', function () {
      it('should add editorconfig to the project files.',
        function () {
          editorconfig.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          expect(files.length).toBe(1);
          expect(files[0].from).toBe('.editorconfig');
          expect(files[0].to).toBe('.editorconfig');
        });
    });
  });
})();
