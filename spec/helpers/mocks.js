(function () {
  'use strict';

  function buildMockGenerator (config, mockAnswers, mockOptions) {
    var configDefaults = {};
    config = config || {};
    mockAnswers = mockAnswers || {};

    return {
      appname: 'generator-openstack',
      async: function () {
        return function () {
        };
      },
      config: {
        defaults: function (values) {
          Object.keys(values).forEach(function (key) {
            configDefaults[key] = values[key];
          });
        },
        get: function (value) {
          return config[value] || configDefaults[value];
        },
        set: function (key, value) {
          if (typeof key === 'object') {
            Object.keys(key).forEach(function (index) {
              config[index] = key[index];
            });
          } else {
            config[key] = value;
          }
        }
      },
      prompt: function (params, callback) {
        var answers = {};
        params.forEach(function (param) {

          if (param.when && !param.when(answers)) {
            return;
          }

          if (mockAnswers.hasOwnProperty(param.name)) {
            answers[param.name] = mockAnswers[param.name];
          } else {
            answers[param.name] = param.default || null;
          }

        });
        callback(answers);
      },
      options: mockOptions
    };
  }

  module.exports = {
    buildGenerator: buildMockGenerator
  };
})();
