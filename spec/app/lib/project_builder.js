(function () {
  'use strict';
  var builder = require('../../../generators/app/lib/project_builder');

  describe('generator-openstack:lib/project_builder', function () {

    beforeEach(function () {
      builder.clear();
    });

    it('should start with an empty list of included files',
      function () {
        expect(builder.getIncludedFiles().length).toBe(0);
      });

    it('should start with an empty list of excluded files',
      function () {
        expect(builder.getExcludedFiles().length).toBe(0);
      });

    it('should permit adding a file with only one path.',
      function () {
        var testFilePath = 'test_path.json';

        builder.addFile(testFilePath);
        var testFile = builder.getIncludedFiles()[0];

        expect(testFile.from).toBe(testFilePath);
        expect(testFile.to).toBe(testFilePath);
      });

    it('should permit adding a file with a different destination path.',
      function () {
        var testFilePath = 'test_path.json';
        var testFileOutput = 'test_path_output.json';

        builder.addFile(testFilePath, testFileOutput);
        var testFile = builder.getIncludedFiles()[0];

        expect(testFile.from).toBe(testFilePath);
        expect(testFile.to).toBe(testFileOutput);
      });

    it('should permit adding a file to the exclusion list',
      function () {
        var testFilePath = 'test_path.json';
        builder.removeFile(testFilePath);
        expect(builder.getExcludedFiles()[0]).toBe(testFilePath);
      });
  });
})();
