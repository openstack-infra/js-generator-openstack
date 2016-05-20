(function () {
  'use strict';

  var yeoman = require('yeoman-generator');
  var projectBuilder = require('./lib/project_builder');
  var Q = require('q');

  var pkg = require('./lib/component/pkg');
  var gerrit = require('./lib/component/gerrit');
  var editorconfig = require('./lib/component/editorconfig');
  var license = require('./lib/component/license');
  var eslint = require('./lib/component/eslint');
  var gitignore = require('./lib/component/gitignore');

  module.exports = yeoman.Base.extend({

    constructor: function () {
      yeoman.Base.apply(this, arguments);

      // Add support for a `--non-interactive` flag
      this.option('non-interactive');
    },

    initializing: function () {
      var done = this.async();

      // Set our own defaults.
      this.config.defaults({
        projectName: this.appname
      });

      // Initialize components.
      Q(this)
        .then(pkg.init)             // Package.json
        .then(gerrit.init)          // Gerrit
        .then(editorconfig.init)    // Editorconfig
        .then(license.init)         // Licensing
        .then(eslint.init)          // Linting
        .then(gitignore.init)       // Gitignore
        .then(function () {
          done();
        });
    },

    prompting: function () {
      var done = this.async();

      // Prompt components.
      Q(this)
        .then(pkg.prompt)             // Package.json
        .then(gerrit.prompt)          // Gerrit
        .then(editorconfig.prompt)    // Editorconfig
        .then(license.prompt)         // Licensing
        .then(eslint.prompt)          // Linting
        .then(gitignore.prompt)       // Gitignore
        .then(function () {
          done();
        });
    },

    configuring: function () {
      var done = this.async();

      // Configure components.
      Q(this)
        .then(pkg.configure)             // Package.json
        .then(gerrit.configure)          // Gerrit
        .then(editorconfig.configure)    // Editorconfig
        .then(license.configure)         // Licensing
        .then(eslint.configure)          // Linting
        .then(gitignore.configure)       // Gitignore
        .then(function () {
          done();
        });
    },

    writing: function () {
      var self = this;
      var config = self.config.getAll();
      var included = projectBuilder.getIncludedFiles();
      var excluded = projectBuilder.getExcludedFiles();

      // Write out all files included in the project builder.
      included.forEach(function (fileRef) {
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
      excluded.forEach(function (path) {
        self.fs.delete(self.destinationPath(path));
      });
    }
  });
})();
