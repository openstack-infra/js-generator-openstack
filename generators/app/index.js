(function () {

  'use strict';
  var yeoman = require('yeoman-generator');

  module.exports = yeoman.generators.Base.extend({
    initializing: function () {
      this.composeWith('openstack:gerrit', {options: this.options});
      this.composeWith('openstack:editorconfig', {options: this.options});
      this.composeWith('openstack:license', {options: this.options});
    },

    constructor: function () {
      yeoman.generators.Base.apply(this, arguments);

      // This method adds support for a `--non-interactive` flag
      this.option('non-interactive');
    },

    install: function () {
      this.installDependencies();
    }
  });
})();
