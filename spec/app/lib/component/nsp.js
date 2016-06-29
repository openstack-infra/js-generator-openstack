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

var nsp = require(libDir + '/component/nsp');
var projectBuilder = require(libDir + '/project_builder');
var pkgBuilder = require(libDir + '/pkg_builder');
var mocks = require('../../../helpers/mocks');
var mockGenerator;

describe('generator-openstack:lib/component/nsp', function () {

  beforeEach(function () {
    mockGenerator = mocks.buildGenerator();
    projectBuilder.clear();
  });

  it('should define init, prompt, and configure',
    function () {
      expect(typeof nsp.init).toBe('function');
      expect(typeof nsp.prompt).toBe('function');
      expect(typeof nsp.configure).toBe('function');
    });

  describe('init()', function () {
    it('should return a generator',
      function () {
        var outputGenerator = nsp.init(mockGenerator);
        expect(outputGenerator).toEqual(mockGenerator);
      });

    it('should do nothing',
      function () {
        var spy = spyOn(mockGenerator.config, 'defaults');
        nsp.init(mockGenerator);
        expect(spy.calls.any()).toBeFalsy();
      });
  });

  describe('prompt()', function () {
    it('should return a generator',
      function () {
        var outputGenerator = nsp.prompt(mockGenerator);
        expect(outputGenerator).toEqual(mockGenerator);
      });

    it('should add nsp to dependencies',
      function () {
        pkgBuilder.fromJSON('{"devDependencies":{}}');

        var devDeps = pkgBuilder.getValue('devDependencies');
        expect(devDeps.nsp).not.toBeDefined();

        nsp.prompt(mockGenerator);

        devDeps = pkgBuilder.getValue('devDependencies');
        expect(devDeps.nsp).toBeDefined();
      });

    it('should add the prepublish hook to the project',
      function () {
        pkgBuilder.fromJSON('{}');

        var scripts = pkgBuilder.getValue('scripts');
        expect(scripts).not.toBeDefined();

        nsp.prompt(mockGenerator);

        var newScripts = pkgBuilder.getValue('scripts');
        expect(newScripts.prepublish).toBeDefined();
        expect(newScripts.prepublish).toEqual('nsp check');
      });
  });

  describe('configure()', function () {
    it('should return a generator',
      function () {
        var outputGenerator = nsp.configure(mockGenerator);
        expect(outputGenerator).toEqual(mockGenerator);
      });

    it('should add .nsprc to the project files.',
      function () {
        nsp.configure(mockGenerator);

        var files = projectBuilder.getIncludedFiles();
        expect(files.length).toBe(1);
        expect(files[0].from).toBe('.nsprc');
        expect(files[0].to).toBe('.nsprc');
      });
  });
});
