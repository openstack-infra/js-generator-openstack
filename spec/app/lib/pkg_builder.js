/*
 * Copyright (c) 2016 Hewlett Packard Enterprise Development Company, LP
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

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

  describe('addDependencies()', function () {
    var eslintVersion = dependencies.read('eslint');

    it('should be able to add to dependencies', function () {
      builder.fromJSON('{"dependencies":{}}');
      builder.addDependencies('eslint');
      expect(builder.getValue('dependencies').eslint).toBe(eslintVersion);

      builder.fromJSON('{"dependencies":{}}');
      builder.addDependencies(['eslint']);
      expect(builder.getValue('dependencies').eslint).toBe(eslintVersion);

      builder.fromJSON('{"dependencies":{}}');
      builder.addDependencies('eslint', 'dependencies');
      expect(builder.getValue('dependencies').eslint).toBe(eslintVersion);

      builder.fromJSON('{"dependencies":{}}');
      builder.addDependencies(['eslint'], 'dependencies');
      expect(builder.getValue('dependencies').eslint).toBe(eslintVersion);
    });

    it('should be able to add to devDependencies', function () {
      builder.fromJSON('{"devDependencies":{}}');
      builder.addDependencies('eslint', 'devDependencies');
      expect(builder.getValue('devDependencies').eslint).toBe(eslintVersion);

      builder.fromJSON('{"devDependencies":{}}');
      builder.addDependencies(['eslint'], 'devDependencies');
      expect(builder.getValue('devDependencies').eslint).toBe(eslintVersion);
    });

    it('should be able to add to peerDependencies', function () {
      builder.fromJSON('{"peerDependencies":{}}');
      builder.addDependencies('eslint', 'peerDependencies');
      expect(builder.getValue('peerDependencies').eslint).toBe(eslintVersion);

      builder.fromJSON('{"peerDependencies":{}}');
      builder.addDependencies(['eslint'], 'peerDependencies');
      expect(builder.getValue('peerDependencies').eslint).toBe(eslintVersion);
    });

    it('should create dependency maps if they don\'t yet exist in the package', function () {
      builder.fromJSON('{}');
      builder.addDependencies('eslint');
      builder.addDependencies('eslint', 'devDependencies');
      builder.addDependencies('eslint', 'peerDependencies');
      expect(builder.getValue('dependencies')).not.toBeUndefined();
      expect(builder.getValue('devDependencies')).not.toBeUndefined();
      expect(builder.getValue('peerDependencies')).not.toBeUndefined();
    });

    it('should not modify things if an invalid section was declared', function () {
      builder.fromJSON('{}');
      builder.addDependencies('eslint', 'lol');
      expect(builder.getValues()).toEqual({});
    });

    it('should not override an existing dependency declaration', function () {
      builder.fromJSON('{"dependencies":{"eslint":"0.0.1"}}');
      builder.addDependencies(['eslint'], 'dependencies');
      expect(builder.getValue('dependencies').eslint).toEqual('0.0.1');
    });

    it('should not add a dependency that is not globally managed', function () {
      builder.fromJSON('{}');
      builder.addDependencies('leftpad');
      expect(builder.getValues()).toEqual({dependencies: {}});
    });
  });

  describe('addCommand', function () {
    it('should add a command', function () {
      builder.fromJSON('{"scripts":{}}');
      builder.addCommand('foo', 'bar');
      expect(builder.getValue('scripts').foo).toBe('bar');
    });

    it('should overwrite an existing command', function () {
      builder.fromJSON('{"scripts":{"foo":"bar"}}');
      builder.addCommand('foo', 'lol');
      expect(builder.getValue('scripts').foo).toBe('lol');
    });

    it('should create the scripts hash if it doesn\'t exist', function () {
      builder.fromJSON('{}');
      builder.addCommand('foo', 'bar');
      expect(builder.getValue('scripts')).toBeDefined();
    });
  });
});
