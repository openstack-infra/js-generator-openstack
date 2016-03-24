(function () {
  'use strict';
  var libDir = '../../../../generators/app/lib';

  var license = require(libDir + '/component/license');
  var projectBuilder = require(libDir + '/project_builder');
  var mocks = require('../../../helpers/mocks');
  var mockGenerator;

  describe('generator-openstack:lib/component/license', function () {

    beforeEach(function () {
      mockGenerator = mocks.buildGenerator();
      projectBuilder.clear();
    });

    it('should define init, prompt, and configure',
      function () {
        expect(typeof license.init).toBe('function');
        expect(typeof license.prompt).toBe('function');
        expect(typeof license.configure).toBe('function');
      });

    describe('init()', function () {
      it('should do nothing',
        function () {
          var spy = spyOn(mockGenerator.config, 'defaults');
          license.init(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('prompt()', function () {
      it('should do nothing',
        function () {
          var spy = spyOn(mockGenerator, 'prompt');
          license.prompt(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('configure()', function () {
      it('should add license to the project files.',
        function () {
          license.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          expect(files.length).toBe(1);
          expect(files[0].from).toBe('LICENSE');
          expect(files[0].to).toBe('LICENSE');
        });
    });
  });
})();
