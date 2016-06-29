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

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var generator = path.join(__dirname, '../../generators/app');
var modules = ['gerrit', 'license', 'editorconfig'];
var projectBuilder = require('../../generators/app/lib/project_builder');

describe('generator-openstack:app', function () {

  beforeEach(function () {
    projectBuilder.clear();
  });

  it('should call all module lifecycle prompts',
    function (done) {
      var spies = [];
      modules.forEach(function (name) {
        var module = require('../../generators/app/lib/component/' + name);
        spies.push(spyOn(module, 'init').and.callThrough());
        spies.push(spyOn(module, 'prompt').and.callThrough());
        spies.push(spyOn(module, 'configure').and.callThrough());
      });

      helpers.run(generator)
        .withArguments(['--non-interactive'])
        .on('end', function () {
          spies.forEach(function (spy) {
            expect(spy.calls.any()).toBeTruthy();
          });

          done();
        });
    });

  it('should force overwrite if --non-interactive is set.',
    function (done) {
      helpers.run(generator)
        .withArguments(['--non-interactive'])
        .on('ready', function (generator) {
          expect(generator.conflicter.force).toBeTruthy();
        })
        .on('end', function () {
          done();
        });
    });

  describe('writing()', function () {
    it('should create all files created in the project builder',
      function (done) {
        helpers.run(generator)
          .withArguments(['--non-interactive'])
          .on('end', function () {
            assert.file(['package.json']);
            done();
          });
      });

    it('should write any files provided to the content builder',
      function (done) {
        projectBuilder.writeFile('test.json', function () {
          return 'foo';
        });
        projectBuilder.writeFile('test_null.json', function () {
          // do nothing.
        });
        projectBuilder.writeFile('test_empty.json', function () {
          return '';
        });
        projectBuilder.writeFile('test_static.json', 'static_content');
        projectBuilder.writeFile('test_undefined.json');

        helpers.run(generator)
          .withArguments(['--non-interactive'])
          .on('end', function () {
            assert.file(['test.json', 'test_static.json', 'test_empty.json', 'test_null.json',
              'test_undefined.json']);
            done();
          });
      });

    it('should delete all files flagged in the project builder',
      function (done) {
        projectBuilder.removeFile('test.json');

        helpers.run(generator)
          .withArguments(['--non-interactive'])
          .on('end', function () {
            assert.noFile(['test.json']);
            done();
          });
      });
  });
});
