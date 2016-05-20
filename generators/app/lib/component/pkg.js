(function () {
  'use strict';

  var pkgBuilder = require('../pkg_builder');
  var projectBuilder = require('../project_builder');

  var packagePath = 'package.json';

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
   * Read any existing package.json file, to set our defaults.
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function initializePackage (generator) {
    var fs = generator.fs;

    // Read package.json
    if (fs.exists(packagePath)) {
      pkgBuilder.fromJSON(fs.read(packagePath));
    }

    return generator;
  }

  /**
   * Configure the project by adding required files.
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function configurePkg (generator) {
    projectBuilder.writeFile('package.json', pkgBuilder.toJSON);
    return generator;
  }

  module.exports = {
    init: initializePackage,
    prompt: noop,
    configure: configurePkg
  };
})();
