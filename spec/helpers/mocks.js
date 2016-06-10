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

(function () {
  'use strict';

  function buildMockGenerator (config, mockAnswers, mockOptions) {
    var configDefaults = {};
    var memFs = require('mem-fs');
    var editor = require('mem-fs-editor');
    var store = memFs.create();

    config = config || {};
    mockAnswers = mockAnswers || {};
    mockOptions = mockOptions || {};

    return {
      fs: editor.create(store),
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
