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
var builder = require('../../../generators/app/lib/global_dependencies');
var globals = require('../../../global-dependencies.json');
var semver = require('semver');

describe('lib/global_dependencies', function () {

  describe('data', function () {
    it('should contain all dependencies from the root global-dependencies.json',
      function () {
        for (var key in globals) {
          if (globals.hasOwnProperty(key)) {
            expect(builder.contains(key)).toBe(true);
          }
        }
      });

    it('should contain valid semver versions for all dependencies',
      function () {
        for (var key in globals) {
          if (globals.hasOwnProperty(key)) {
            var version = builder.read(key);
            expect(semver.validRange(version)).toBeTruthy();
          }
        }
      });
  });

  describe('contains()', function () {
    it('should return true when a dependency exists', function () {
      expect(builder.contains('eslint')).toBe(true);
    });

    it('should return false when a dependency doesn\'t exist', function () {
      expect(builder.contains('notarealdependency')).toBe(false);
    });
  });

  describe('read()', function () {
    it('should return the version of a dependency', function () {
      expect(builder.read('eslint')).toBe(globals.eslint);
    });

    it('should return undefined when a dependency doesn\'t exist', function () {
      expect(builder.read('notarealdependency')).toBeUndefined();
    });
  });

  describe('synchronize()', function () {
    it('should update dependencies that are out of date.', function () {
      var testDeps = {
        eslint: '0.0.1'
      };
      var newDeps = builder.synchronize(testDeps);

      expect(newDeps.eslint).toBeDefined();
      expect(newDeps.eslint).not.toEqual(testDeps.eslint);
      expect(newDeps.eslint).toEqual(globals.eslint);
    });

    it('should not update dependencies that are up to date.', function () {
      var testDeps = {
        eslint: globals.eslint
      };
      var newDeps = builder.synchronize(testDeps);
      expect(newDeps).toEqual(testDeps);
    });

    it('should not touch unregistered dependencies.', function () {
      var testDeps = {
        notarealdependency: '0.0.1'
      };
      var newDeps = builder.synchronize(testDeps);
      expect(newDeps.notarealdependency).toEqual(testDeps.notarealdependency);
    });
  });
});
