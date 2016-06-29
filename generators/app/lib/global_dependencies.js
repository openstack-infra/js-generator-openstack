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
 * Access to the global-dependencies.json file.
 */

'use strict';

var globalDependencies = require('../../../global-dependencies.json');

/**
 * Returns whether a dependency is in the global-dependencies list.
 *
 * @param {String} name The name of the dependency.
 * @returns {Boolean} True if the dependency exists, otherwise false.
 */
function containsDependency (name) {
  return globalDependencies.hasOwnProperty(name);
}

/**
 * Return the current acceptable version of the dependencies, or null.
 *
 * @param {String} name The dependency name.
 * @returns {String|undefined} The version, or undefined.
 */
function getVersion (name) {
  return globalDependencies[name] || undefined;
}

/**
 * Given a list of dependencies, updates this list of dependencies to the versions that are
 * currently set in global-dependencies.
 *
 * @param {{}} dependencies The list of dependencies.
 * @returns {{}} The above list of dependencies, with only the appropriate versions updated.
 */
function synchronizeDependencies (dependencies) {
  var results = {};
  for (var key in dependencies) {
    if (globalDependencies.hasOwnProperty(key)) {
      results[key] = globalDependencies[key];
    } else {
      results[key] = dependencies[key];
    }
  }
  return results;
}

module.exports = {
  contains: containsDependency,
  read: getVersion,
  synchronize: synchronizeDependencies
};
