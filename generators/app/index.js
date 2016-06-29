/*
 * Copyright (c) 2016 Hewlett Packard Enterprise Development Company, LP
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

'use strict';

var yeoman = require('yeoman-generator');
var projectBuilder = require('./lib/project_builder');
var Q = require('q');

var pkg = require('./lib/component/pkg');
var gerrit = require('./lib/component/gerrit');
var editorconfig = require('./lib/component/editorconfig');
var license = require('./lib/component/license');
var structure = require('./lib/component/structure');
var eslint = require('./lib/component/eslint');
var gitignore = require('./lib/component/gitignore');
var nsp = require('./lib/component/nsp');

module.exports = yeoman.Base.extend({

  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // Add support for a `--non-interactive` flag
    this.option('non-interactive');

    // If non-interactive is set, force-override all files.
    this.conflicter.force = this.options['non-interactive'];
  },

  initializing: function () {
    var done = this.async();

    // Initialize components.
    Q(this)
      .then(pkg.init)             // Package.json
      .then(gerrit.init)          // Gerrit
      .then(editorconfig.init)    // Editorconfig
      .then(license.init)         // Licensing
      .then(structure.init)       // Project Structure
      .then(eslint.init)          // Linting
      .then(gitignore.init)       // Gitignore
      .then(nsp.init)             // NSP
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
      .then(structure.prompt)       // Project Structure
      .then(eslint.prompt)          // Linting
      .then(gitignore.prompt)       // Gitignore
      .then(nsp.prompt)             // NSP
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
      .then(structure.configure)       // Project Structure
      .then(eslint.configure)          // Linting
      .then(gitignore.configure)       // Gitignore
      .then(nsp.configure)             // NSP
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
  },

  install: function () {
    this.npmInstall();
  }
});
