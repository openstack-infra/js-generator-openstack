(function () {
  'use strict';

  var yeoman = require('yeoman-generator');

  module.exports = yeoman.generators.Base.extend({

    prompting: function () {
      var done = this.async();
      var self = this;
      var config = self.config.getAll();

      /**
       * Helper method, returns true if gerrit support is enabled.
       *
       * @param {{}} answers The current user response hash.
       * @returns {Boolean} True if gerrit is enabled, otherwise false.
       */
      function enableGerrit (answers) {
        // First check the config object
        if (config.hasOwnProperty('enableGerrit')) {
          return !!config.enableGerrit;
        }
        // Now check the answers.
        return !!answers.enableGerrit;
      }

      var prompts = [{
        type: 'confirm',
        required: true,
        name: 'enableGerrit',
        message: 'Will this project be managed by Gerrit?',
        default: true
      }, {
        when: enableGerrit,
        type: 'input',
        required: true,
        name: 'gerritHost',
        message: 'Gerrit URL:',
        default: 'review.openstack.org'
      }, {
        when: enableGerrit,
        type: 'input',
        required: true,
        name: 'gerritPort',
        message: 'Gerrit Port:',
        default: 29418
      }, {
        when: enableGerrit,
        type: 'input',
        required: true,
        name: 'gerritProject',
        message: 'Gerrit Project:',
        default: 'openstack/your_project.git'
      }];

      // Filter out anything not already set in .yo.rc
      prompts = prompts.filter(function (item) {
        return !config.hasOwnProperty(item.name);
      });

      self.prompt(prompts, function (answers) {
        self.config.set(answers);
        done();
      });
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
