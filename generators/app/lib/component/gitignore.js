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
    var ignoreContent = Object.keys(excludedPaths).sort().join('\n');
    if (ignoreContent.length === 0) {
      // Delete the file if there's nothing to ignore.
      projectBuilder.removeFile(filePath);
    } else {
      projectBuilder.writeFile(filePath, ignoreContent);
    }

    return generator;
  }

  module.exports = {
    init: initGitignore,
    prompt: noop,
    configure: configureGitIgnore
  };
})();
