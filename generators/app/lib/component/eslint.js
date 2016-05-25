(function () {
  'use strict';

  var pkgBuilder = require('../pkg_builder');
  var projectBuilder = require('../project_builder');
  var yaml = require('js-yaml');

  var excludedPaths = {};
  var ignoreFile = '.eslintignore';
  var rcFile = '.eslintrc';
  var eslintrc = {extends: 'openstack'};

  /**
   * This method configures the package builder with all options necessary to support eslint.
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function promptEslint (generator) {
    // At this time, we don't actually need to prompt the user.

    // Add the dependencies.
    pkgBuilder.addDependencies(['eslint', 'eslint-config-openstack'], 'devDependencies');

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

    // Re-initialize excluded paths.
    excludedPaths = {};

    // Read .eslintignore.
    if (fs.exists(ignoreFile)) {
      var paths = fs.read(ignoreFile)
        .split('\n')
        .filter(function (item) {
          // Remove empty lines.
          return item.length > 0;
        });

      for (var i = 0; i < paths.length; i++) {
        excludedPaths[paths[i]] = true;
      }
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
   * Generate the content of our .eslintignore file from the configured list of excluded paths,
   * as well as any project-level configured ignoreFiles.
   *
   * @returns {string} The content of the .eslintignore file.
   */
  function buildEslintIgnore () {
    var ignoredFiles = projectBuilder.getIgnoredFiles();
    for (var i = 0; i < ignoredFiles.length; i++) {
      if (!excludedPaths.hasOwnProperty(ignoredFiles[i])) {
        excludedPaths[ignoredFiles[i]] = true;
      }
    }

    return Object.keys(excludedPaths).sort().join('\n');
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
    prompt: promptEslint,
    configure: configureEslint
  };
})();
