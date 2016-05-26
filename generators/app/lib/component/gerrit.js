(function() {
  'use strict';

  var projectBuilder = require('../project_builder');
  var pkgBuilder = require('../pkg_builder');
  var ini = require('ini');
  var Q = require('q');

  var gerritFile = '.gitreview';
  var iniContent;
  var gerritFileExists = false;

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
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function initializeGerrit (generator) {
    // Define our defaults
    iniContent = {
      gerrit: {
        host: 'review.openstack.org',
        port: '29418',
        project: 'openstack/test-project.git'
      }
    };
    return generator;
  }

  /**
   * Initialize the gerrit component of this generator. In this case, we're
   * only adding default configuration values.
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function promptUserOptions (generator) {

    // Read the existing file and populate it as defaults.
    if (generator.fs.exists(gerritFile)) {
      gerritFileExists = true;
      iniContent = ini.parse(generator.fs.read(gerritFile));
    } else {
      // Create project name from package name if gerrit file does not exist
      var projectName = pkgBuilder.getValue("name");
      iniContent.gerrit.project = 'openstack/' + projectName + '.git';
    }

    var deferred = Q.defer();

    if (!generator.options['non-interactive']) {
      // Go through the prompts.
      generator.prompt(
        [{
          type: 'confirm',
          name: 'enableGerrit',
          message: 'Gerrit- Enable:',
          default: gerritFileExists
        }, {
          when: gerritEnabled,
          type: 'input',
          name: 'gerritHost',
          message: 'Gerrit- Host:',
          default: iniContent.gerrit.host
        }, {
          when: gerritEnabled,
          type: 'input',
          name: 'gerritPort',
          message: 'Gerrit- Port:',
          default: iniContent.gerrit.port
        }, {
          when: gerritEnabled,
          type: 'input',
          name: 'gerritProject',
          message: 'Gerrit- Project Path:',
          default: iniContent.gerrit.project
        }],
        function(answers) {
          gerritFileExists = answers.enableGerrit;
          iniContent.gerrit = {
            host: answers.gerritHost,
            port: answers.gerritPort,
            project: answers.gerritProject
          };
          deferred.resolve(generator);
        });
    } else {
      deferred.resolve(generator);
    }
    return deferred.promise;
  }

  /**
   * Configure gerrit
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function configureGerrit (generator) {
    if (gerritFileExists) {
      projectBuilder.writeFile(gerritFile, buildGerritFile);
    } else {
      projectBuilder.removeFile(gerritFile);
    }

    return generator;
  }

  function buildGerritFile () {
    return ini.stringify(iniContent);
  }

  module.exports = {
    init: initializeGerrit,
    prompt: promptUserOptions,
    configure: configureGerrit
  };
})
();
