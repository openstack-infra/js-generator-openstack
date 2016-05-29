(function () {
  'use strict';

  var globals = require('../global_dependencies');
  var pkgBuilder = require('../pkg_builder');

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
  function configureTesting (generator) {
    var devDeps = globals.synchronize({
      istanbul: '',
      jasmine: ''
    });

    pkgBuilder.setValues({
      devDependencies: devDeps,
      script: {
        test: 'istanbul cover jasmine'
      }
    });
    return generator;
  }

  module.exports = {
    init: noop,
    prompt: noop,
    configure: configureTesting
  };
})();
