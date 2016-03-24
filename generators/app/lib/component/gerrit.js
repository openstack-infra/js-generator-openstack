(function () {
  'use strict';

  var projectBuilder = require('../project_builder');

  /**
   * Internal helper method. Returns true if gerrit has been enabled.
   *
   * @param {String} answers The collection of answers.
   * @returns {Function} True if enableGerrit is set, otherwise false.
   */
  var gerritEnabled = function (answers) {
    return !!answers.enableGerrit;
  };

  /**
   * Initialize the gerrit component of this generator. In this case, we're
   * only adding default configuration values.
   *
   * @param {Base} generator The generator to configure.
   * @returns {void}
   */
  function initializeGerrit (generator) {
    // Set the configuration defaults.
    generator.config.defaults({
      enableGerrit: true,
      gerritHost: 'review.openstack.org',
      gerritPort: 29418,
      gerritProject: 'openstack/' + generator.appname + '.git'
    });
  }

  /**
   * Initialize the gerrit component of this generator. In this case, we're
   * only adding default configuration values.
   *
   * @param {Base} generator The generator to configure.
   * @returns {void}
   */
  function promptUserOptions (generator) {
    var done = generator.async();

    var prompts = [{
      type: 'confirm',
      name: 'enableGerrit',
      message: 'Will this project be managed by Gerrit?',
      default: generator.config.get('enableGerrit')
    }, {
      when: gerritEnabled,
      type: 'input',
      name: 'gerritHost',
      message: 'Gerrit URL:',
      default: generator.config.get('gerritHost')
    }, {
      when: gerritEnabled,
      type: 'input',
      name: 'gerritPort',
      message: 'Gerrit Port:',
      default: generator.config.get('gerritPort')
    }, {
      when: gerritEnabled,
      type: 'input',
      name: 'gerritProject',
      message: 'Gerrit Project:',
      default: generator.config.get('gerritProject')
    }];

    // Go through the prompts.
    generator.prompt(prompts,
      function (answers) {
        generator.config.set(answers);
        done();
      });
  }

  function configureGerrit (generator) {
    if (generator.config.get('enableGerrit')) {
      projectBuilder.addFile('.gitreview');
    } else {
      projectBuilder.removeFile('.gitreview');
    }
  }

  module.exports = {
    init: initializeGerrit,
    prompt: promptUserOptions,
    configure: configureGerrit
  };
})();
