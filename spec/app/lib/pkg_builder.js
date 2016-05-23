(function () {
  'use strict';
  var builder = require('../../../generators/app/lib/pkg_builder');
  var dependencies = require('../../../generators/app/lib/global_dependencies');

  describe('generator-openstack:lib/pkg_builder', function () {

    beforeEach(function () {
      builder.fromJSON("{}"); // Clear
    });

    it('should start as an empty object',
      function () {
        expect(builder.toJSON()).toBe("{}");
      });

    it('should honor and echo back any pre-loaded package file',
      function () {
        var packageString = '{"name":"foo"}';
        builder.fromJSON(packageString);

        var parsedResult = JSON.parse(builder.toJSON());
        expect(parsedResult.name).toBe("foo");
      });

    it('should permit adding and overriding values.',
      function () {
        builder.fromJSON('{"name":"foo"}');
        builder.setValues({name: "bar", lol: "cat"});

        var parsedResult = JSON.parse(builder.toJSON());
        expect(parsedResult.name).toBe("bar");
        expect(parsedResult.lol).toBe("cat");
      });

    it('should not add parent prototype values.',
      function () {
        function Thing () {
        }

        Thing.prototype.foo = 'bar';

        var thing = new Thing();
        thing.name = 'bar';
        thing.lol = 'cat';

        builder.fromJSON('{"name":"foo"}');
        builder.setValues(thing);

        var parsedResult = JSON.parse(builder.toJSON());
        expect(parsedResult.name).toBe("bar");
        expect(parsedResult.lol).toBe("cat");
        expect(parsedResult.foo).toBeUndefined();
      });

    describe('toJSON()', function () {
      it('should update out-of-date dependencies.',
        function () {
          var testPackage = {
            dependencies: {
              eslint: "0.0.1"
            },
            peerDependencies: {
              eslint: "0.0.1"
            },
            devDependencies: {
              eslint: "0.0.1"
            }
          };

          builder.fromJSON(JSON.stringify(testPackage));
          var result = JSON.parse(builder.toJSON());
          expect(result.dependencies.eslint).toBe(dependencies.read('eslint'));
          expect(result.peerDependencies.eslint).toBe(dependencies.read('eslint'));
          expect(result.devDependencies.eslint).toBe(dependencies.read('eslint'));
        });

      it('should not error if no dependencies are declared.',
        function () {
          var testPackage = {
            dependencies: {
              eslint: "0.0.1"
            }
          };

          builder.fromJSON(JSON.stringify(testPackage));
          var result = JSON.parse(builder.toJSON());
          expect(result.dependencies.eslint).toBe(dependencies.read('eslint'));
        });
    });

    describe('getValues()', function () {
      it('should permit retrieving the entire package block.',
        function () {
          builder.fromJSON('{"name":"foo"}');
          expect(builder.getValues()).toEqual({name: 'foo'});
        });
    });

    describe('getValue()', function () {
      it('should permit retrieving values from the package.',
        function () {
          builder.fromJSON('{"name":"foo"}');
          expect(builder.getValue('name')).toBe('foo');
        });

      it('should return undefined if the value is not set.',
        function () {
          builder.fromJSON('{"name":"foo"}');
          expect(builder.getValue('invalidname')).toBeUndefined();
        });

      it('should return a default if provided.',
        function () {
          builder.fromJSON('{"name":"foo"}');
          expect(builder.getValue('invalidname', 'defaultValue'))
            .toBe('defaultValue');
        });
    });
  });
})();
