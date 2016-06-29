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

var structure = require(libDir + '/component/structure');
var projectBuilder = require(libDir + '/project_builder');
var mocks = require('../../../helpers/mocks');
var mockGenerator;

var expectedDefaults = {
  engine: 'browser',
  language: 'es5',
  srcDir: './src',
  distDir: './dist',
  testDir: './test'
};

describe('generator-openstack:lib/component/structure', function () {

  beforeEach(function () {
    mockGenerator = mocks.buildGenerator();
    jasmine.clock().install();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  it('should define init, prompt, and configure',
    function () {
      expect(typeof structure.init).toBe('function');
      expect(typeof structure.prompt).toBe('function');
      expect(typeof structure.configure).toBe('function');
    });

  describe('init()', function () {
    it('should return a generator',
      function () {
        var outputGenerator = structure.init(mockGenerator);
        expect(outputGenerator).toEqual(mockGenerator);
      });

    it('should set configuration defaults',
      function () {
        var spy = spyOn(mockGenerator.config, 'defaults');
        structure.init(mockGenerator);
        expect(spy).toHaveBeenCalledWith(expectedDefaults);
      });
  });

  describe('prompt()', function () {

    it('should return a promise that resolves with a generator',
      function () {
        var generator = mocks.buildGenerator();
        var outputPromise = structure.prompt(generator);
        outputPromise.then(function (outputGenerator) {
          expect(outputGenerator).toEqual(generator);
        });
      });

    it('should revert to config defaults if no answers provided',
      function () {
        var config = {};
        var mockAnswers = {};
        var generator = mocks.buildGenerator(config, mockAnswers);

        // Call the component
        structure.init(generator);
        structure.prompt(generator);
        structure.configure(generator);

        Object.keys(expectedDefaults).forEach(function (key) {
          expect(generator.config.get(key)).toEqual(expectedDefaults[key]);
        });
      });

    it('should not show a prompt if non-interactive is set',
      function () {
        var generator = mocks.buildGenerator(null, null, {'non-interactive': true});
        var promptSpy = spyOn(generator, 'prompt');

        structure.init(generator);
        structure.prompt(generator);

        expect(promptSpy.calls.any()).toBeFalsy();
      });

    it('should configure answers if answers provided',
      function () {
        var config = {};
        var mockAnswers = {
          language: 'es6',
          srcDir: './dir',
          distDir: './foo',
          testDir: './bar'
        };
        var generator = mocks.buildGenerator(config, mockAnswers);

        // Set defaults
        structure.init(generator);
        structure.prompt(generator);
        structure.configure(generator);

        Object.keys(mockAnswers).forEach(function (key) {
          expect(generator.config.get(key)).toEqual(mockAnswers[key]);
        });
      });

    it('should not configure the dist directory for a node project',
      function () {
        var config = {};
        var mockAnswers = {
          engine: 'node',
          distDir: './foo' // This answer should never be read.
        };
        var generator = mocks.buildGenerator(config, mockAnswers);

        // Set defaults
        structure.init(generator);
        structure.prompt(generator);
        structure.configure(generator);

        expect(generator.config.get('distDir')).not.toBe(mockAnswers.distDir);
      });

    it('should configure the dist directory for a browser project',
      function () {
        var config = {};
        var mockAnswers = {
          engine: 'browser',
          distDir: './foo' // This answer should never be read.
        };
        var generator = mocks.buildGenerator(config, mockAnswers);

        // Set defaults
        structure.init(generator);
        structure.prompt(generator);
        structure.configure(generator);

        expect(generator.config.get('distDir')).toBe(mockAnswers.distDir);
      });
  });

  describe('configure()', function () {
    it('should return a generator',
      function () {
        var outputGenerator = structure.configure(mockGenerator);
        expect(outputGenerator).toEqual(mockGenerator);
      });

    it('should add the dist directory to the ignoreFile.',
      function () {
        var ignoreSpy = spyOn(projectBuilder, 'ignoreFile');

        var generator = mocks.buildGenerator();

        structure.init(generator);
        structure.prompt(generator);
        structure.configure(generator);

        expect(ignoreSpy).toHaveBeenCalledWith('./dist');
      });
  });
});
