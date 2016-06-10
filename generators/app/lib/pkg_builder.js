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

  var dependencies = require('./global_dependencies');
  var pkgContent = {};

  /**
   * Convert a package.json formatted list of dependencies and update them to the versions
   * listed in our global dependencies.
   *
   * @param {{}} dependencyMap The map of dependencies.
   * @returns {{}} A clone of the map, updated with current common versions.
   */
  function synchronizeDependencies (dependencyMap) {
    if (!dependencyMap) {
      return undefined;
    }

    // Cloning not necessary, handled in dependencies.synchronize();
    return dependencies.synchronize(dependencyMap);
  }

  /**
   * Initialize this builder from a JSON string.
   *
   * @param {String} pkgString The package string content.
   * @returns {void}
   */
  function readPackage (pkgString) {
    pkgContent = JSON.parse(pkgString);
  }

  /**
   * Write the package content to a JSON string.
   *
   * @returns {String} The JSON content of the package, as a string.
   */
  function writePackage () {
    // Clone the package content so we don't destroy what's in memory...
    var newContent = JSON.parse(JSON.stringify(pkgContent));

    // Synchronize all the dependencies.
    newContent.peerDependencies = synchronizeDependencies(newContent.peerDependencies);
    newContent.dependencies = synchronizeDependencies(newContent.dependencies);
    newContent.devDependencies = synchronizeDependencies(newContent.devDependencies);
    return JSON.stringify(newContent, null, 2);
  }

  /**
   * Add libraries to the package dependencies.
   *
   * @param {[]|String} libraryNames A list of all libraries to add to the dependencies.
   * @param {String} type The type of dependency.
   * @returns {void}
   */
  function addDependencies (libraryNames, type) {
    // Default the type.
    type = type || 'dependencies';

    // Valuecheck type.
    if (['devDependencies', 'peerDependencies', 'dependencies'].indexOf(type) === -1) {
      return;
    }

    // Default the array.
    if (!Array.isArray(libraryNames)) {
      libraryNames = [libraryNames];
    }

    // Make sure the property exists.
    if (!pkgContent.hasOwnProperty(type)) {
      pkgContent[type] = {};
    }

    // Add the dependency
    libraryNames.forEach(function (library) {
      var version = dependencies.read(library);
      if (version && !pkgContent[type].hasOwnProperty(library)) {
        pkgContent[type][library] = version;
      }
    });
  }

  /**
   * Set values on the current package.
   *
   * @param {{}} values A map of values.
   * @returns {void}
   */
  function setValues (values) {
    for (var key in values) {
      // Filter out things from prototype.
      if (values.hasOwnProperty(key)) {
        pkgContent[key] = values[key];
      }
    }
  }

  /**
   * Get the values of the current package.
   *
   * @returns {{}} A cloned map of the values.
   */
  function getValues () {
    return JSON.parse(JSON.stringify(pkgContent));
  }

  /**
   * Get a specific value from the package.json file, or a default if the
   * value is not set.
   *
   * @param {String} name The name of the value.
   * @param {String} defaultValue A default value to return.
   * @returns {{}} A clone of the referenced value.
   */
  function getValue (name, defaultValue) {
    if (pkgContent.hasOwnProperty(name)) {
      return JSON.parse(JSON.stringify(pkgContent[name]));
    }
    return defaultValue || undefined;
  }

  /**
   * Create a specific NPM script command, invoked by 'npm run <name>' or 'npm <name>'.
   *
   * @param {String} name The name of the script.
   * @param {String} command The command to invoke.
   * @returns {void}
   */
  function addCommand (name, command) {

    // sanity check, does 'scripts' exist?
    if (!pkgContent.hasOwnProperty('scripts')) {
      pkgContent.scripts = {};
    }

    // Save/Override the command.
    pkgContent.scripts[name] = command;
  }

  module.exports = {
    fromJSON: readPackage,
    toJSON: writePackage,
    setValues: setValues,
    getValues: getValues,
    getValue: getValue,
    addDependencies: addDependencies,
    addCommand: addCommand
  };
})();
