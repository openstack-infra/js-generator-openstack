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
   * @returns {void}
   */
  function noop () {
    // Do nothing.
  }

  /**
   * Read the existing .eslintrc and .eslintignore files, and populate our initial configuration
   * with them.
   *
   * @param {*} generator The currently active yeoman generator.
   * @returns {void}
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
  }

  /**
   * Configure the project by adding required files.
   *
   * @returns {void}
   */
  function configureEslint () {
    if (buildEslintIgnore().length === 0) {
      projectBuilder.removeFile('.eslintignore');
    } else {
      projectBuilder.writeFile('.eslintignore', buildEslintIgnore);
    }
    projectBuilder.writeFile('.eslintrc', buildEslintRc);
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
