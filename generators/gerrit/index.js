(function () {
  'use strict';

  var yeoman = require('yeoman-generator');

  module.exports = yeoman.generators.Base.extend({

    /**
     * Prompt the user for additional configuration variables.
     */
    prompting: function () {
      var done = this.async();

      /**
       * Helper method, returns true if gerrit support is enabled.
       *
       * @param response The current user response hash.
       * @returns {Boolean} True if gerrit is enabled, otherwise false.
       */
      function enableGerrit (response) {
        return response.enableGerrit;
      }

      var prompts = [{
        type: 'confirm',
        name: 'enableGerrit',
        message: 'Will this project be managed by Gerrit?',
        default: true
      }, {
        when: enableGerrit,
        type: 'input',
        name: 'gerritHost',
        message: 'Gerrit URL:',
        default: 'review.openstack.org'
      }, {
        when: enableGerrit,
        type: 'input',
        name: 'gerritPort',
        message: 'Gerrit Port:',
        default: 29418
      }, {
        when: enableGerrit,
        type: 'input',
        name: 'gerritProject',
        message: 'Gerrit Project:',
        default: 'openstack/your_project.git'
      }];

      this.prompt(prompts, function (props) {
        this.props = props;
        done();
      }.bind(this));
    },
    writing: function () {
      // If gerrit is enabled, write .gitreview
      if (this.props.enableGerrit) {
        this.fs.copyTpl(
          this.templatePath('.gitreview'),
          this.destinationPath('.gitreview'),
          this.props
        );
      }
    }
  });
})();
