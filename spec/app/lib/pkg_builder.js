(function() {
  'use strict';
  var builder = require('../../../generators/app/lib/pkg_builder');

  describe('generator-openstack:lib/pkg_builder', function() {

    beforeEach(function() {
      builder.fromJSON("{}"); // Clear
    });

    it('should start as an empty object',
      function() {
        expect(builder.toJSON()).toBe("{}");
      });

    it('should honor and echo back any pre-loaded package file',
      function() {
        var packageString = '{"name":"foo"}';
        builder.fromJSON(packageString);

        var parsedResult = JSON.parse(builder.toJSON());
        expect(parsedResult.name).toBe("foo");
      });

    it('should permit adding and overriding values.',
      function() {
        builder.fromJSON('{"name":"foo"}');
        builder.setValues({name: "bar", lol: "cat"});

        var parsedResult = JSON.parse(builder.toJSON());
        expect(parsedResult.name).toBe("bar");
        expect(parsedResult.lol).toBe("cat");
      });

    it('should not add parent prototype values.',
      function() {
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
  });
})();
