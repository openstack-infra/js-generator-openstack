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

(function () {
  'use strict';
  var libDir = '../../../../generators/app/lib';

  var editorconfig = require(libDir + '/component/editorconfig');
  var projectBuilder = require(libDir + '/project_builder');
  var mocks = require('../../../helpers/mocks');
  var mockGenerator;

  describe('generator-openstack:lib/component/editorconfig', function () {

    beforeEach(function () {
      mockGenerator = mocks.buildGenerator();
      projectBuilder.clear();
    });

    it('should define init, prompt, and configure',
      function () {
        expect(typeof editorconfig.init).toBe('function');
        expect(typeof editorconfig.prompt).toBe('function');
        expect(typeof editorconfig.configure).toBe('function');
      });

    describe('init()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = editorconfig.init(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should do nothing',
        function () {
          var spy = spyOn(mockGenerator.config, 'defaults');
          editorconfig.init(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('prompt()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = editorconfig.prompt(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should do nothing',
        function () {
          var spy = spyOn(mockGenerator, 'prompt');
          editorconfig.prompt(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('configure()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = editorconfig.configure(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should add editorconfig to the project files.',
        function () {
          editorconfig.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          expect(files.length).toBe(1);
          expect(files[0].from).toBe('.editorconfig');
          expect(files[0].to).toBe('.editorconfig');
        });
    });
  });
})();
