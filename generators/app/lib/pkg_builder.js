(function() {
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

  module.exports = {
    fromJSON: readPackage,
    toJSON: writePackage,
    setValues: setValues
  };
})();
