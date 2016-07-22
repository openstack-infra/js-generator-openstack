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
 * This module adds the Node Security commandline tool (nsp) to the project.
 * Its job is to identify known vulnerabilities by scanning the projects
 * source and dependencies.
 * @module
 */

'use strict';

var projectBuilder = require('../project_builder');
var pkgBuilder = require('../pkg_builder');

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
 * This method configures the package builder with all options necessary
 * to run nsp.
 *
 * @param {generator} generator The currently active generator.
 * @returns {generator} The passed generator, for promise chaining.
 */
function prompt (generator) {
  // At this time, we don't actually need to prompt the user.

  // Add the dependencies.
  pkgBuilder.addDependencies(['nsp'], 'devDependencies');
  pkgBuilder.addCommand('prepublish', 'nsp check');

  return generator;
}

/**
 * Configure the project by adding required files.
 *
 * @param {generator} generator The currently active generator.
 * @returns {generator} The passed generator, for promise chaining.
 */
function configure (generator) {
  projectBuilder.addFile('.nsprc');
  return generator;
}

module.exports = {
  /** @see {@link module:component/nsp~noop} */
  init: noop,
  /** @see {@link module:component/nsp~prompt} */
  prompt: prompt,
  /** @see {@link module:component/nsp~configure} */
  configure: configure
};
