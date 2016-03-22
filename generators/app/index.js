(function () {

  'use strict';
  var yeoman = require('yeoman-generator');

  module.exports = yeoman.generators.Base.extend({
    initializing: function () {
      this.composeWith('openstack:gerrit');
      this.composeWith('openstack:editorconfig');
      this.composeWith('openstack:license');
    },

    install: function () {
      this.installDependencies();
    }
  });
})();
