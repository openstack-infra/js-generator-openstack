(function() {
  'use strict';

  var projectBuilder = require('../project_builder');
  var yaml = require('js-yaml');

  var excludedPaths = [];
  var ignoreFile = '.eslintignore';
  var rcFile = '.eslintrc';
  var eslintrc = {extends: 'openstack'};

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
   * Read the existing .eslintrc and .eslintignore files, and populate our initial configuration
   * with them.
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function initializeEslint (generator) {
    var fs = generator.fs;

    // Read .eslintignore.
    if (fs.exists(ignoreFile)) {
      excludedPaths = fs.read(ignoreFile)
        .split('\n')
        .filter(function(item) {
          // Remove empty lines.
          return item.length > 0;
        });
    }

    // Read .eslintrc
    if (fs.exists(rcFile)) {
      eslintrc = yaml.safeLoad(fs.read(rcFile));
    }

    return generator;
  }

  /**
   * Configure the project by adding required files.
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function configureEslint (generator) {
    if (buildEslintIgnore().length === 0) {
      projectBuilder.removeFile('.eslintignore');
    } else {
      projectBuilder.writeFile('.eslintignore', buildEslintIgnore);
    }
    projectBuilder.writeFile('.eslintrc', buildEslintRc);

    return generator;
  }

  /**
   * Generate the content of our .eslintignore file from the configured list of excluded paths.
   *
   * @returns {string} The content of the .eslintignore file.
   */
  function buildEslintIgnore () {
    return excludedPaths.sort().join('\n');
  }

  /**
   * Generate the content of our .eslintrc file from the current configuration.
   *
   * @returns {string} The content of the .eslintrc file.
   */
  function buildEslintRc () {
    return yaml.safeDump(eslintrc);
  }

  module.exports = {
    init: initializeEslint,
    prompt: noop,
    configure: configureEslint
  };
})();
