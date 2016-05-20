(function () {
  'use strict';
  var libDir = '../../../../generators/app/lib';

  var pkg = require(libDir + '/component/pkg');
  var projectBuilder = require(libDir + '/project_builder');
  var pkgBuilder = require(libDir + '/pkg_builder');
  var mocks = require('../../../helpers/mocks');
  var mockGenerator;

  describe('generator-openstack:lib/component/pkg', function () {

    beforeEach(function () {
      mockGenerator = mocks.buildGenerator();
      projectBuilder.clear();
    });

    it('should define init, prompt, and configure',
      function () {
        expect(typeof pkg.init).toBe('function');
        expect(typeof pkg.prompt).toBe('function');
        expect(typeof pkg.configure).toBe('function');
      });

    describe('init()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = pkg.init(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should read an existing package.json file into the package builder',
        function () {
          mockGenerator.fs.writeJSON("package.json", {name: "foo"});

          pkg.init(mockGenerator);
          var output = JSON.parse(pkgBuilder.toJSON());
          expect(output.name).toBe('foo');
        });
    });

    describe('prompt()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = pkg.prompt(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should do nothing',
        function () {
          var spy = spyOn(mockGenerator, 'prompt');
          pkg.prompt(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('configure()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = pkg.configure(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should add package.json to the project files.',
        function () {
          pkg.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          expect(files.length).toBe(1);
          expect(files[0].to).toBe('package.json');
          expect(files[0].content).toBe(pkgBuilder.toJSON);
        });
    });
  });
})();
