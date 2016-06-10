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

  var pkg = require(libDir + '/component/pkg');
  var projectBuilder = require(libDir + '/project_builder');
  var pkgBuilder = require(libDir + '/pkg_builder');
  var mocks = require('../../../helpers/mocks');
  var mockGenerator;

  var packageFile = {};

  describe('generator-openstack:lib/component/pkg', function () {

    beforeEach(function () {
      mockGenerator = mocks.buildGenerator();
      projectBuilder.clear();
      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
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

      it('should add several files to the ignore list.',
        function () {
          pkg.init(mockGenerator);

          var ignoredFiles = projectBuilder.getIgnoredFiles();
          expect(ignoredFiles.indexOf('node_modules')).not.toBe(-1);
          expect(ignoredFiles.indexOf('npm-debug.log')).not.toBe(-1);
          expect(ignoredFiles.indexOf('package')).not.toBe(-1);
          expect(ignoredFiles.indexOf('.npm')).not.toBe(-1);
        });
    });

    describe('prompt()', function () {

      it('should return a promise that resolves with a generator',
        function () {
          var generator = mocks.buildGenerator();
          var outputPromise = pkg.prompt(generator);
          outputPromise.then(function (outputGenerator) {
            expect(outputGenerator).toEqual(generator);
          });
        });

      it('should revert to config defaults if no answers provided',
        function () {
          var config = {};
          var mockAnswers = {};
          var generator = mocks.buildGenerator(config, mockAnswers);

          // Start with a blank package file.
          generator.fs.write('package.json', JSON.stringify({}));

          // Set defaults
          pkg.init(generator);
          pkg.configure(generator);
          pkg.prompt(generator);

          // Call the generator
          expect(pkgBuilder.getValues()).toEqual({
            name: generator.appname,
            description: null,
            version: '0.0.1',
            homepage: 'http://www.openstack.org/',
            author: 'OpenStack <openstack-dev@lists.openstack.org> (http://www.openstack.org/)'
          });
        });

      it('should not show a prompt if non-interactive is set',
        function () {
          var generator = mocks.buildGenerator(null, null,
            {'non-interactive': true});
          var promptSpy = spyOn(generator, 'prompt');

          generator.fs.write('package.json', JSON.stringify(packageFile));

          pkg.init(generator);
          pkg.prompt(generator);

          expect(promptSpy.calls.any()).toBeFalsy();
        });

      it('should use defaults in package.json if no answers provided',
        function () {
          var generator = mocks.buildGenerator();

          var mockPackage = {
            name: 'name',
            description: 'description',
            version: '0.0.1',
            homepage: 'http://www.openstack.org/',
            author: 'OpenStack <openstack-dev@lists.openstack.org> (http://www.openstack.org/)'
          };
          generator.fs.write('package.json', JSON.stringify(mockPackage));

          pkg.init(generator);
          pkg.configure(generator);
          pkg.prompt(generator);

          expect(pkgBuilder.getValues()).toEqual(mockPackage);
        });

      it('should configure answers if answers provided',
        function () {
          var config = {};
          var mockAnswers = {
            name: 'name',
            description: 'description',
            version: '1.0.0',
            homepage: 'http://example.openstack.org/',
            author: 'Example Author'
          };
          var generator = mocks.buildGenerator(config, mockAnswers);

          // Start with a blank package file.
          generator.fs.write('package.json', JSON.stringify({}));

          // Set defaults
          pkg.init(generator);
          pkg.prompt(generator);
          pkg.configure(generator);

          expect(pkgBuilder.getValues()).toEqual(mockAnswers);
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
