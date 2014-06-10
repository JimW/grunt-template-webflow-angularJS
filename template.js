/*
 * webflow-angularJS grunt template
 * https://gruntjs.com/
 *
 * Copyright (c) 2014 Jim Waterwash
 * Licensed under the MIT license.
 */

'use strict';

exports.description = 'Generates and helps sync a sample angularJS site with a UI defined within a downloaded webflow.com zip.' +
                      '  By following a few rules on marking webflow.com elements, webflow.com can more easily be integrated into a web app.';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'This template tries to guess file and directory paths, but ' +
  'you will most likely need to edit the generated Gruntfile.js file or at least the config files before ' +
  'running grunt. _If you run grunt after generating the Gruntfile, and ' +
  'it exits with errors, edit the file!_';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = 'Gruntfile.js';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({}, [
  
  ], function(err, props) {

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Actually copy (and process) files. But don't process zip files or you get corruption
    init.copyAndProcess(files, props, {noProcess: '**/*.zip'});

    var devDependencies = {

      "grunt": "^0.4.5",
      "grunt-contrib-clean": "^0.5.0",
      "grunt-contrib-connect": "^0.7.1",
      "grunt-contrib-copy": "^0.5.0",
      "grunt-contrib-jshint": "^0.10.0",
      "grunt-contrib-nodeunit": "^0.4.0",
      "grunt-contrib-watch": "^0.6.1",
      "grunt-dom-munger": "^3.4.0",
      "grunt-zip": "^0.13.0"

    };

    // Generate package.json file, used by npm and grunt.
    init.writePackageJSON('package.json', {
      node_version: '>= 0.10.0',
      devDependencies: devDependencies
    });

    // All done!
    done();
  });

};
