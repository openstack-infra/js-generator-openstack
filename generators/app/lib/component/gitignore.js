(function () {
  'use strict';

  var projectBuilder = require('../project_builder');

  var excludedPaths = {};
  var filePath = '.gitignore';

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
   * Read the existing .gitignore file, and populate our current list of ignores.
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function initGitignore (generator) {
    var fs = generator.fs;

    // Reinitialize the ignore map.
    excludedPaths = {};

    // Read .gitignore.
    if (fs.exists(filePath)) {
      fs.read(filePath)
        // Split into lines
        .split('\n')
        // Remove empty lines and comments.
        .filter(function (item) {
          return item.length > 0 && !item.match(/\s*#/);
        })
        // Add to our list.
        .map(function (line) {
          excludedPaths[line] = true;
        });
    }

    return generator;
  }

  /**
   * Generate the .gitignore file from the data we've imported.
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function configureGitIgnore (generator) {
    var ignoreContent = buildGitignore();
    if (ignoreContent.length === 0) {
      // Delete the file if there's nothing to ignore.
      projectBuilder.removeFile(filePath);
    } else {
      projectBuilder.writeFile(filePath, buildGitignore);
    }

    return generator;
  }

  /**
   * Generate the content of our .gitignore file from the configured list of excluded paths,
   * as well as any project-level configured ignoreFiles.
   *
   * @returns {string} The content of the .eslintignore file.
   */
  function buildGitignore () {
    var ignoredFiles = projectBuilder.getIgnoredFiles();
    for (var i = 0; i < ignoredFiles.length; i++) {
      if (!excludedPaths.hasOwnProperty(ignoredFiles[i])) {
        excludedPaths[ignoredFiles[i]] = true;
      }
    }

    return Object.keys(excludedPaths).sort().join('\n');
  }

  module.exports = {
    init: initGitignore,
    prompt: noop,
    configure: configureGitIgnore
  };
})();
