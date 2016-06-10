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

/**
 * This generator module handles questions regarding the project's structure,
 * such as engine, common output directories, and language level. It informs
 * other generators, such as test framework generation, packaging tools,
 * and/or configuration files.
 */
(function () {
  'use strict';

  var Q = require('q');
  var projectBuilder = require('../project_builder');

  /**
   * Initialize the component by setting configuration defaults. These, or previously set
   * versions, will be accessible immediately, however it's good practice not to access them
   * until after the prompting phase, as we cannot guarantee that they will be properly set.
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function initialize (generator) {

    // Set our defaults:
    generator.config.defaults({
      engine: 'browser',
      language: 'es5',
      srcDir: './src',
      distDir: './dist',
      testDir: './test'
    });

    return generator;
  }

  /**
   * If applicable, prompt the user for a project type.
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function prompt (generator) {
    var deferred = Q.defer();

    // We default to a node.js project.
    if (!generator.options['non-interactive']) {
      // Go through the prompts.
      generator.prompt(
        [{
          type: 'list',
          name: 'engine',
          message: 'Structure- Runtime Engine:',
          choices: [
            {
              name: 'Browser',
              value: 'browser'
            },
            {
              name: 'Node.js',
              value: 'node'
            }
          ],
          default: generator.config.get('engine')
        }, {
          type: 'list',
          name: 'language',
          message: 'Structure- Language:',
          choices: [
            {
              name: 'ECMAScript 5',
              value: 'es5'
            },
            {
              name: 'ECMAScript 6',
              value: 'es6'
            }
          ],
          default: generator.config.get('language')
        }, {
          type: 'input',
          name: 'srcDir',
          message: 'Structure- Source Directory:',
          default: generator.config.get('srcDir')
        }, {
          type: 'input',
          name: 'testDir',
          message: 'Structure- Test Directory:',
          default: generator.config.get('testDir')
        }, {
          type: 'input',
          name: 'distDir',
          message: 'Structure- Dist Directory:',
          default: generator.config.get('distDir'),
          when: function (answers) {
            return answers.engine === 'browser';
          }
        }],
        function (answers) {
          generator.config.set(answers);
          deferred.resolve(generator);
        });
    } else {
      deferred.resolve(generator);
    }
    return deferred.promise;
  }

  /**
   * Add any outut directories to the ignore files.
   *
   * @param {generator} generator The currently active generator.
   * @returns {generator} The passed generator, for promise chaining.
   */
  function configure (generator) {
    projectBuilder.ignoreFile(generator.config.get('distDir'));
    return generator;
  }

  module.exports = {
    init: initialize,
    prompt: prompt,
    configure: configure
  };
})();
