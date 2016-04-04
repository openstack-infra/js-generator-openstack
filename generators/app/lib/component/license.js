(function () {
  'use strict';

  var projectBuilder = require('../project_builder');

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
   * Configure the project by adding required files.
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function configureLicense (generator) {
    projectBuilder.addFile('LICENSE');

    return generator;
  }

  module.exports = {
    init: noop,
    prompt: noop,
    configure: configureLicense
  };
})();
