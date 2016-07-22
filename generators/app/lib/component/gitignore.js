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

/**
 * Package gitignore module
 * @module
 */

'use strict';

var projectBuilder = require('../project_builder');

var excludedPaths = {};
var filePath = '.gitignore';

/**
 * No-op placeholder method, for handlers we don't need.
 *
 * @param {generator} generator The currently active generator.
 * @returns {generator} The passed generator, for promise chaining.
 */
function noop (generator) {
  return generator;
}

/**
 * Read the existing .gitignore file, and populate our current list of ignores.
 *
 * @param {generator} generator The currently active generator.
 * @returns {generator} The passed generator, for promise chaining.
 */
function init (generator) {
  var fs = generator.fs;

  // Reinitialize the ignore map.
  excludedPaths = {};

  // Read .gitignore.
  if (fs.exists(filePath)) {
    fs.read(filePath)
      // Split into lines
      .split('\n')
      // Remove empty lines and comments.
      .filter(function (item) {
        return item.length > 0 && !item.match(/\s*#/);
      })
      // Add to our list.
      .map(function (line) {
        excludedPaths[line] = true;
      });
  }

  return generator;
}

/**
 * Generate the .gitignore file from the data we've imported.
 *
 * @param {generator} generator The currently active generator.
 * @returns {generator} The passed generator, for promise chaining.
 */
function configure (generator) {
  var ignoreContent = buildGitignore();
  if (ignoreContent.length === 0) {
    // Delete the file if there's nothing to ignore.
    projectBuilder.removeFile(filePath);
  } else {
    projectBuilder.writeFile(filePath, buildGitignore);
  }

  return generator;
}

/**
 * Generate the content of our .gitignore file from the configured list of excluded paths,
 * as well as any project-level configured ignoreFiles.
 *
 * @returns {string} The content of the .eslintignore file.
 */
function buildGitignore () {
  var ignoredFiles = projectBuilder.getIgnoredFiles();
  for (var i = 0; i < ignoredFiles.length; i++) {
    if (!excludedPaths.hasOwnProperty(ignoredFiles[i])) {
      excludedPaths[ignoredFiles[i]] = true;
    }
  }

  return Object.keys(excludedPaths).sort().join('\n');
}

module.exports = {
  /** @see {@link module:component/gitignore~init} */
  init: init,
  /** @see {@link module:component/gitignore~noop} */
  prompt: noop,
  /** @see {@link module:component/gitignore~configure} */
  configure: configure
};
