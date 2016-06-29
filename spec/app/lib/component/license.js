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

var libDir = '../../../../generators/app/lib';

var license = require(libDir + '/component/license');
var projectBuilder = require(libDir + '/project_builder');
var pkgBuilder = require(libDir + '/pkg_builder');
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
    it('should return a generator',
      function () {
        var outputGenerator = license.init(mockGenerator);
        expect(outputGenerator).toEqual(mockGenerator);
      });

    it('should do nothing',
      function () {
        var spy = spyOn(mockGenerator.config, 'defaults');
        license.init(mockGenerator);
        expect(spy.calls.any()).toBeFalsy();
      });
  });

  describe('prompt()', function () {
    it('should return a generator',
      function () {
        var outputGenerator = license.prompt(mockGenerator);
        expect(outputGenerator).toEqual(mockGenerator);
      });

    it('should do nothing',
      function () {
        var spy = spyOn(mockGenerator, 'prompt');
        license.prompt(mockGenerator);
        expect(spy.calls.any()).toBeFalsy();
      });
  });

  describe('configure()', function () {
    it('should return a generator',
      function () {
        var outputGenerator = license.configure(mockGenerator);
        expect(outputGenerator).toEqual(mockGenerator);
      });

    it('should add license to the project files.',
      function () {
        license.configure(mockGenerator);

        var files = projectBuilder.getIncludedFiles();
        expect(files.length).toBe(1);
        expect(files[0].from).toBe('LICENSE');
        expect(files[0].to).toBe('LICENSE');
      });

    it('should add license to the package.json files.',
      function () {
        license.configure(mockGenerator);

        var parsedResult = JSON.parse(pkgBuilder.toJSON());
        expect(parsedResult.license).toBe("Apache-2.0");
      });
  });
});
