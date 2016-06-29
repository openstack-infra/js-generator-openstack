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
var builder = require('../../../generators/app/lib/project_builder');

describe('generator-openstack:lib/project_builder', function () {

  beforeEach(function () {
    builder.clear();
  });

  it('should start with an empty list of included files',
    function () {
      expect(builder.getIncludedFiles().length).toBe(0);
    });

  it('should start with an empty list of excluded files',
    function () {
      expect(builder.getExcludedFiles().length).toBe(0);
    });

  it('should permit adding a file with only one path.',
    function () {
      var testFilePath = 'test_path.json';

      builder.addFile(testFilePath);
      var testFile = builder.getIncludedFiles()[0];

      expect(testFile.from).toBe(testFilePath);
      expect(testFile.to).toBe(testFilePath);
    });

  it('should permit adding a file with a different destination path.',
    function () {
      var testFilePath = 'test_path.json';
      var testFileOutput = 'test_path_output.json';

      builder.addFile(testFilePath, testFileOutput);
      var testFile = builder.getIncludedFiles()[0];

      expect(testFile.from).toBe(testFilePath);
      expect(testFile.to).toBe(testFileOutput);
    });

  it('should permit adding a file to the exclusion list',
    function () {
      var testFilePath = 'test_path.json';
      builder.removeFile(testFilePath);
      expect(builder.getExcludedFiles()[0]).toBe(testFilePath);
    });

  it('should permit adding a file to the ignore list',
    function () {
      var testFilePath = 'test_path.json';
      builder.ignoreFile(testFilePath);
      expect(builder.getIgnoredFiles()[0]).toBe(testFilePath);
    });
});
