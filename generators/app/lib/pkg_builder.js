(function () {
  'use strict';

  var pkgContent = {};

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
    return JSON.stringify(pkgContent, null, 2);
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
