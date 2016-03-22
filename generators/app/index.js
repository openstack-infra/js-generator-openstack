(function () {

  'use strict';
  var yeoman = require('yeoman-generator');

  module.exports = yeoman.generators.Base.extend({
    initializing: function () {
      this.composeWith('openstack:_gerrit', {options: this.options});
      this.composeWith('openstack:_editorconfig', {options: this.options});
      this.composeWith('openstack:_license', {options: this.options});
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
