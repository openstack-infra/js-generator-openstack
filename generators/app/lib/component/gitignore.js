(function () {
  'use strict';

  var projectBuilder = require('../project_builder');

  /**
   * No-op placeholder method, for handlers we don't need.
   *
   * @returns {void}
   */
  function noop () {
    // Do nothing.
  }

  /**
   * Configure the project by adding required files.
   *
   * @returns {void}
   */
  function configureGitIgnore () {
    projectBuilder.addFile('.gitignore');
  }

  module.exports = {
    init: noop,
    prompt: noop,
    configure: configureGitIgnore
  };
})();
