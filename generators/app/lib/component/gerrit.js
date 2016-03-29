(function() {
  'use strict';

  var projectBuilder = require('../project_builder');
  var ini = require('ini');

  var gerritFile = '.gitreview';
  var iniDefaults = {
    gerrit: {
      host: 'review.openstack.org',
      port: '29418',
      project: 'openstack/test_project.git'
    }
  };
  var iniContent;

  /**
   * Internal helper method. Returns true if gerrit has been enabled.
   *
   * @param {String} answers The collection of answers.
   * @returns {Function} True if enableGerrit is set, otherwise false.
   */
  var gerritEnabled = function(answers) {
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
    // Define our defaults
    iniContent = JSON.parse(JSON.stringify(iniDefaults));
    iniContent.gerrit.project = 'openstack/' + generator.appname + '.git';

    // Read the existing file and populate it as defaults.
    if (generator.fs.exists(gerritFile)) {
      iniContent = ini.parse(generator.fs.read(gerritFile));
    }

    // Set the configuration defaults.
    generator.config.defaults({enableGerrit: true});
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
      default: iniContent.gerrit.host
    }, {
      when: gerritEnabled,
      type: 'input',
      name: 'gerritPort',
      message: 'Gerrit Port:',
      default: iniContent.gerrit.port
    }, {
      when: gerritEnabled,
      type: 'input',
      name: 'gerritProject',
      message: 'Gerrit Project:',
      default: iniContent.gerrit.project
    }];

    // Go through the prompts.
    generator.prompt(prompts,
      function(answers) {
        generator.config.set({
          enableGerrit: answers.enableGerrit
        });

        iniContent.gerrit = {
          host: answers.gerritHost,
          port: answers.gerritPort,
          project: answers.gerritProject
        };
        done();
      });
  }

  function configureGerrit (generator) {
    if (generator.config.get('enableGerrit')) {
      projectBuilder.writeFile(gerritFile, buildGerritFile);
    } else {
      projectBuilder.removeFile(gerritFile);
    }
  }

  function buildGerritFile () {
    return ini.stringify(iniContent);
  }

  module.exports = {
    init: initializeGerrit,
    prompt: promptUserOptions,
    configure: configureGerrit
  };
})();
