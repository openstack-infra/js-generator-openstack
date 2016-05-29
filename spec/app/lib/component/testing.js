(function () {
  'use strict';
  var libDir = '../../../../generators/app/lib';

  var testing = require(libDir + '/component/testing');
  var pkgBuilder = require(libDir + '/pkg_builder');
  var mocks = require('../../../helpers/mocks');
  var mockGenerator;

  describe('generator-openstack:lib/component/testing', function () {

    beforeEach(function () {
      mockGenerator = mocks.buildGenerator();
    });

    it('should define init, prompt, and configure',
      function () {
        expect(typeof testing.init).toBe('function');
        expect(typeof testing.prompt).toBe('function');
        expect(typeof testing.configure).toBe('function');
      });

    describe('init()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = testing.init(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should do nothing',
        function () {
          var spy = spyOn(mockGenerator.config, 'defaults');
          testing.init(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('prompt()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = testing.prompt(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should do nothing',
        function () {
          var spy = spyOn(mockGenerator, 'prompt');
          testing.prompt(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('configure()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = testing.configure(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should add testing modules to package',
        function () {
          testing.configure(mockGenerator);

          var devDeps = pkgBuilder.getValue('devDependencies');
          expect(devDeps).toEqual({ istanbul: '^0.4.2', jasmine: '^2.4.1' });

          var scripts = pkgBuilder.getValue('script');
          expect(scripts.test).toEqual('istanbul cover jasmine');
        });
    });
  });
})();
