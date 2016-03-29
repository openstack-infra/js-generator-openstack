(function() {
  'use strict';

  var yeoman = require('yeoman-generator');
  var projectBuilder = require('./lib/project_builder');

  var gerrit = require('./lib/component/gerrit');
  var editorconfig = require('./lib/component/editorconfig');
  var license = require('./lib/component/license');
  var eslint = require('./lib/component/eslint');
  var gitignore = require('./lib/component/gitignore');

  module.exports = yeoman.generators.Base.extend({

    constructor: function() {
      yeoman.generators.Base.apply(this, arguments);

      // Add support for a `--non-interactive` flag
      this.option('non-interactive');
    },

    initializing: function() {
      // Set our own defaults.
      this.config.defaults({
        projectName: this.appname
      });

      // Initialize components.
      gerrit.init(this);          // Gerrit
      editorconfig.init(this);    // Editorconfig
      license.init(this);         // Licensing
      eslint.init(this);          // Linting
      gitignore.init(this);       // Gitignore
    },

    prompting: function() {
      if (!this.options['non-interactive']) {
        // Prompt components.
        gerrit.prompt(this);          // Gerrit
        editorconfig.prompt(this);    // Editorconfig
        license.prompt(this);         // Licensing
        eslint.prompt(this);          // Linting
        gitignore.prompt(this);       // Gitignore
      }
    },

    configuring: function() {
      // Configure components.
      gerrit.configure(this);          // Gerrit
      editorconfig.configure(this);    // Editorconfig
      license.configure(this);         // Licensing
      eslint.configure(this);          // Linting
      gitignore.configure(this);       // Gitignore
    },

    writing: function() {
      var self = this;
      var config = self.config.getAll();
      var included = projectBuilder.getIncludedFiles();
      var excluded = projectBuilder.getExcludedFiles();

      // Write out all files included in the project builder.
      included.forEach(function(fileRef) {
        if (fileRef.hasOwnProperty('content')) {
          var content = typeof fileRef.content === 'function'
            ? "" + fileRef.content()
            : "" + fileRef.content;
          self.fs.write(fileRef.to, content);
        } else {
          self.fs.copyTpl(
            self.templatePath(fileRef.from),
            self.destinationPath(fileRef.to),
            config
          );
        }
      });

      // Delete all files explicitly excluded in the project builder.
      excluded.forEach(function(path) {
        self.fs.delete(self.destinationPath(path));
      });
    }
  });
})();
