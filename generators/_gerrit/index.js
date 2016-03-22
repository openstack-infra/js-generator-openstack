(function () {
  'use strict';

  var yeoman = require('yeoman-generator');

  module.exports = yeoman.generators.Base.extend({

    prompting: function () {
      var done = this.async();
      var self = this;

      // Set our configuration defaults.
      self.config.defaults({
        enableGerrit: true,
        gerritHost: 'review.openstack.org',
        gerritPort: 29418,
        gerritProject: 'openstack/your_project.git'
      });

      /**
       * Helper method, returns true if gerrit support is enabled.
       *
       * @param {{}} answers The current user response hash.
       * @returns {Boolean} True if gerrit is enabled, otherwise false.
       */
      function enableGerrit (answers) {
        // Now check the answers.
        return answers.enableGerrit;
      }

      // Only go through the prompts if we're non-interactive.
      if (!this.options.hasOwnProperty('non-interactive')) {
        self.prompt(
          [{
            type: 'confirm',
            name: 'enableGerrit',
            message: 'Will this project be managed by Gerrit?',
            default: self.config.get('enableGerrit')
          }, {
            when: enableGerrit,
            type: 'input',
            name: 'gerritHost',
            message: 'Gerrit URL:',
            default: self.config.get('gerritHost')
          }, {
            when: enableGerrit,
            type: 'input',
            name: 'gerritPort',
            message: 'Gerrit Port:',
            default: self.config.get('gerritPort')
          }, {
            when: enableGerrit,
            type: 'input',
            name: 'gerritProject',
            message: 'Gerrit Project:',
            default: self.config.get('gerritProject')
          }],
          function (answers) {
            self.config.set(answers);
            done();
          });
      } else {
        done();
      }
    },

    writing: function () {
      var self = this;
      var config = self.config.getAll();

      // If gerrit is enabled, write .gitreview
      if (config.enableGerrit) {
        self.fs.copyTpl(
          self.templatePath('.gitreview'),
          self.destinationPath('.gitreview'),
          config
        );
      }
    }
  });
})();
