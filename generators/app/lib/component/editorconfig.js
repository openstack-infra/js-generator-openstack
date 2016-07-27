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
 * editorconfig module
 * @module
 */

'use strict';

var projectBuilder = require('../project_builder');

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
 * Configure the project by adding required files.
 *
 * @param {generator} generator The currently active generator.
 * @returns {generator} The passed generator, for promise chaining.
 */
function configure (generator) {
  projectBuilder.addFile('.editorconfig');
  return generator;
}

module.exports = {
  /** @see {@link module:component/editorconfig~noop} */
  init: noop,
  /** @see {@link module:component/editorconfig~noop} */
  prompt: noop,
  /** @see {@link module:component/editorconfig~configure} */
  configure: configure
};
