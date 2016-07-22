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
 * eslint module
 * @module
 */

'use strict';

var pkgBuilder = require('../pkg_builder');
var projectBuilder = require('../project_builder');
var yaml = require('js-yaml');

var excludedPaths = [];
var ignoreFile = '.eslintignore';
var rcFile = '.eslintrc';
var rcContent = {extends: 'openstack'};

/**
 * This method configures the package builder with all options necessary to support eslint.
 *
 * @param {generator} generator The currently active generator.
 * @returns {generator} The passed generator, for promise chaining.
 */
function prompt (generator) {
  // At this time, we don't actually need to prompt the user.

  // Add the dependencies.
  pkgBuilder.addDependencies(['eslint', 'eslint-config-openstack'], 'devDependencies');
  pkgBuilder.addCommand('lint', 'eslint ./');

  return generator;
}

/**
 * Read the existing .eslintrc and .eslintignore files, and populate our initial configuration
 * with them.
 *
 * @param {generator} generator The currently active generator.
 * @returns {generator} The passed generator, for promise chaining.
 */
function init (generator) {
  var fs = generator.fs;

  // Re-initialize excluded paths.
  excludedPaths = [];

  // Read .eslintignore.
  if (fs.exists(ignoreFile)) {
    var paths = fs.read(ignoreFile)
      .split('\n')
      .filter(function (item) {
        // Remove empty lines.
        return item.length > 0;
      });

    paths.forEach(function (item) {
      excludedPaths.push(item);
    });
  }

  // Read .eslintrc
  if (fs.exists(rcFile)) {
    rcContent = yaml.safeLoad(fs.read(rcFile));
  }

  return generator;
}

/**
 * Configure the project by adding required files.
 *
 * @param {generator} generator The currently active generator.
 * @returns {generator} The passed generator, for promise chaining.
 */
function configure (generator) {
  if (buildIgnore().length === 0) {
    projectBuilder.removeFile('.eslintignore');
  } else {
    projectBuilder.writeFile('.eslintignore', buildIgnore);
  }
  projectBuilder.writeFile('.eslintrc', buildRc);

  return generator;
}

/**
 * Generate the content of our .eslintignore file from the configured list of excluded paths,
 * as well as any project-level configured ignoreFiles.
 *
 * @returns {string} The content of the .eslintignore file.
 */
function buildIgnore () {
  var ignoredFiles = projectBuilder.getIgnoredFiles();
  ignoredFiles.forEach(function (item) {
    if (excludedPaths.indexOf(item) === -1) {
      excludedPaths.push(item);
    }
  });

  return excludedPaths.sort().join('\n');
}

/**
 * Generate the content of our .eslintrc file from the current configuration.
 *
 * @returns {string} The content of the .eslintrc file.
 */
function buildRc () {
  return yaml.safeDump(rcContent);
}

module.exports = {
  /** @see {@link module:component/eslint~init} */
  init: init,
  /** @see {@link module:component/eslint~prompt} */
  prompt: prompt,
  /** @see {@link module:component/eslint~configure} */
  configure: configure
};
