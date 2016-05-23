(function () {
  'use strict';
  var libDir = '../../../../generators/app/lib';
  var mockGenerator;
  var mockEslintIgnore = ['node_modules', 'bower_components', 'dist'];

  var eslint = require(libDir + '/component/eslint');
  var projectBuilder = require(libDir + '/project_builder');
  var mocks = require('../../../helpers/mocks');
  var yaml = require('js-yaml');

  describe('generator-openstack:lib/component/eslint', function () {

    beforeEach(function () {
      mockGenerator = mocks.buildGenerator();
      mockGenerator.fs.write('.eslintignore', mockEslintIgnore.join('\n'));
      projectBuilder.clear();
    });

    it('should define init, prompt, and configure',
      function () {
        expect(typeof eslint.init).toBe('function');
        expect(typeof eslint.prompt).toBe('function');
        expect(typeof eslint.configure).toBe('function');
      });

    describe('init()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = eslint.init(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should not interact with config',
        function () {
          var spy = spyOn(mockGenerator.config, 'defaults');
          eslint.init(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('prompt()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = eslint.prompt(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should do nothing',
        function () {
          var spy = spyOn(mockGenerator, 'prompt');
          eslint.prompt(mockGenerator);
          expect(spy.calls.any()).toBeFalsy();
        });
    });

    describe('configure()', function () {
      it('should return a generator',
        function () {
          var outputGenerator = eslint.configure(mockGenerator);
          expect(outputGenerator).toEqual(mockGenerator);
        });

      it('should add .eslintrc and .eslintignore to the project files.',
        function () {
          eslint.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          expect(files.length).toBe(2);
          expect(files[0].to).toBe('.eslintignore');
          expect(files[1].to).toBe('.eslintrc');
        });
    });

    describe('.eslintrc management', function () {
      var mockEslintRc = {
        extends: 'openstack',
        plugins: ['angular']
      };

      it('should write a .eslintrc file as valid .yaml',
        function () {
          eslint.init(mockGenerator);
          eslint.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          var eslintRcRef = files[1];
          expect(eslintRcRef.to).toBe('.eslintrc');
          expect(yaml.safeLoad(eslintRcRef.content()))
            .toEqual({extends: 'openstack'});
        });

      it('should echo back existing .eslintrc',
        function () {
          var yamlContent = yaml.safeDump(mockEslintRc);
          mockGenerator.fs.write('.eslintrc', yamlContent);

          eslint.init(mockGenerator);
          eslint.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          var eslintRcRef = files[1];
          var eslintContent = yaml.safeLoad(eslintRcRef.content());
          expect(mockEslintRc).toEqual(eslintContent);
        });

      it('should convert a json .eslintrc to yaml',
        function () {
          mockGenerator.fs.write('.eslintrc', JSON.stringify(mockEslintRc));

          eslint.init(mockGenerator);
          eslint.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          var eslintRcRef = files[1];
          var eslintContent = yaml.safeLoad(eslintRcRef.content());
          expect(mockEslintRc).toEqual(eslintContent);
        });
    });

    describe('.eslintignore management', function () {

      it('should echo back existing .eslintignore',
        function () {
          mockGenerator.fs.write('.eslintignore', mockEslintIgnore.join('\n'));

          eslint.init(mockGenerator);
          eslint.prompt(mockGenerator);
          eslint.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          var ignoreRef = files[0];
          var ignoreContent = ignoreRef.content().split('\n');
          expect(ignoreContent.length).toBe(mockEslintIgnore.length);

          ignoreContent.forEach(function (item) {
            expect(mockEslintIgnore.indexOf(item)).not.toBe(-1);
          });
        });

      it('should include any files flagged as ignored in the project builder.',
        function () {
          mockGenerator.fs.write('.eslintignore', '');
          projectBuilder.ignoreFile('foo/bar.json');

          eslint.init(mockGenerator);
          eslint.prompt(mockGenerator);
          eslint.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          var ignoreRef = files[0]; // There should only be one file.
          var ignoreContent = ignoreRef.content().split('\n');
          expect(ignoreContent.length).toBe(1);

          expect(ignoreContent[0]).toBe('foo/bar.json');
        });

      it('should de-duplicate file paths from multiple locations.',
        function () {
          // include 'node_modules' from both an existing file and from the project builder.
          mockGenerator.fs.write('.eslintignore', ['node_modules'].join('\n'));
          projectBuilder.ignoreFile('node_modules');

          eslint.init(mockGenerator);
          eslint.prompt(mockGenerator);
          eslint.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          var ignoreRef = files[0]; // There should only be one file.
          var ignoreContent = ignoreRef.content().split('\n');
          expect(ignoreContent.length).toBe(1);

          expect(ignoreContent[0]).toBe('node_modules');
        });

      it('should sort the ignored files.',
        function () {
          mockGenerator.fs.write('.eslintignore', mockEslintIgnore.join('\n'));

          eslint.init(mockGenerator);
          eslint.prompt(mockGenerator);
          eslint.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          var ignoreRef = files[0];
          var ignoreContent = ignoreRef.content().split('\n');
          expect(ignoreContent[0]).toBe('bower_components');
          expect(ignoreContent[1]).toBe('dist');
          expect(ignoreContent[2]).toBe('node_modules');
        });

      it('should remove any whitespace from the existing .eslintignore',
        function () {
          mockGenerator.fs.write('.eslintignore', ['1_one', '', '2_two', ''].join('\n'));

          eslint.init(mockGenerator);
          eslint.prompt(mockGenerator);
          eslint.configure(mockGenerator);

          var files = projectBuilder.getIncludedFiles();
          var ignoreRef = files[0];
          var ignoreContent = ignoreRef.content().split('\n');
          expect(ignoreContent.length).toBe(2);
          expect(ignoreContent[0]).toBe('1_one');
          expect(ignoreContent[1]).toBe('2_two');
        });

      it('should delete the file if there\'s nothing to ignore', function () {
        mockGenerator.fs.write('.eslintignore', '');

        eslint.init(mockGenerator);
        eslint.prompt(mockGenerator);
        eslint.configure(mockGenerator);

        var ignoreFiles = projectBuilder.getIgnoredFiles();

        var files = projectBuilder.getIncludedFiles();
        expect(files.length).toBe(1);
        expect(files[0].to).not.toBe('.eslintignore');

        var rmFiles = projectBuilder.getExcludedFiles();
        expect(rmFiles.length).toBe(1);
        expect(rmFiles[0]).toBe('.eslintignore');
      });
    });
  });
})();
