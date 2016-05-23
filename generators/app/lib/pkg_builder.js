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

  module.exports = {
    fromJSON: readPackage,
    toJSON: writePackage,
    setValues: setValues,
    getValues: getValues,
    getValue: getValue
  };
})();
