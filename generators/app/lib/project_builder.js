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

  var includedFiles = [];
  var excludedFiles = [];
  var ignoredFiles = [];

  /**
   * Ensure that a file is removed, or not present, in the project.
   *
   * @param {String} destinationPath Path to the file, relative to output root.
   * @returns {void}
   */
  function removeFile (destinationPath) {
    excludedFiles.push(destinationPath);
  }

  /**
   * Flag a file path as 'ignored'.
   *
   * This does not have a real impact on which files are created/removed from the bootstrapped
   * project, however it does permit other modules to retrieve this list and modify their
   * behavior accordingly. For example, eslint could use this to generate .eslintignore
   *
   * @param {String} destinationPath Path to the file, relative to output root.
   * @returns {void}
   */
  function ignoreFile (destinationPath) {
    ignoredFiles.push(destinationPath);
  }

  /**
   * Add a file to the project.
   *
   * @param {String} sourcePath Path to the file, relative to ./templates/
   * @param {String} destinationPath Destination path relative to output root.
   * @returns {void}
   */
  function addFile (sourcePath, destinationPath) {
    includedFiles.push({from: sourcePath, to: destinationPath || sourcePath});
  }

  /**
   * Write a file to the project.
   *
   * @param {String} destinationPath The destination for the file.
   * @param {String|Function} content A string of content, or method that returns one.
   * @returns {void}
   */
  function writeFile (destinationPath, content) {
    includedFiles.push({to: destinationPath, content: content});
  }

  /**
   * Get a list of all files that are to be included.
   *
   * @returns {Array} A list of all file mappings: {from:, to:}
   */
  function getIncludedFiles () {
    return includedFiles;
  }

  /**
   * Get a list of all file paths that should be excluded.
   *
   * @returns {Array} A list of file paths.
   */
  function getExcludedFiles () {
    return excludedFiles;
  }

  /**
   * Get a list of all file paths that should be ignored.
   *
   * @returns {Array} A list of file paths.
   */
  function getIgnoredFiles () {
    return ignoredFiles;
  }

  /**
   * Clear the current configuration.
   *
   * @returns {void}
   */
  function clearAll () {
    includedFiles = [];
    excludedFiles = [];
    ignoredFiles = [];
  }

  module.exports = {
    addFile: addFile,
    writeFile: writeFile,
    removeFile: removeFile,
    ignoreFile: ignoreFile,
    getIncludedFiles: getIncludedFiles,
    getIgnoredFiles: getIgnoredFiles,
    getExcludedFiles: getExcludedFiles,
    clear: clearAll
  };
})();
