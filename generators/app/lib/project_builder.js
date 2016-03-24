(function () {
  'use strict';

  var includedFiles = [];
  var excludedFiles = [];

  /**
   * Ensure that a file is removed, or not present, in the project.
   *
   * @param {String} destinationPath Path to the file, relative to output root.
   * @returns {void}
   */
  function removeFile (destinationPath) {
    excludedFiles.push(destinationPath);
  }

  /**
   * Add a file to the project.
   *
   * @param {String} sourcePath Path to the file, relative to ./templates/
   * @param {String} destinationPath Destination path relative to output root.
   * @returns {void}
   */
  function addFile (sourcePath, destinationPath) {
    includedFiles.push({from: sourcePath, to: destinationPath || sourcePath});
  }

  /**
   * Get a list of all files that are to be included.
   *
   * @returns {Array} A list of all file mappings: {from:, to:}
   */
  function getIncludedFiles () {
    return includedFiles;
  }

  /**
   * Get a list of all file paths that should be excluded.
   *
   * @returns {Array} A list of file paths.
   */
  function getExcludedFiles () {
    return excludedFiles;
  }

  /**
   * Clear the current configuration.
   *
   * @returns {void}
   */
  function clearAll () {
    includedFiles = [];
    excludedFiles = [];
  }

  module.exports = {
    addFile: addFile,
    removeFile: removeFile,
    getIncludedFiles: getIncludedFiles,
    getExcludedFiles: getExcludedFiles,
    clear: clearAll
  };
})();
