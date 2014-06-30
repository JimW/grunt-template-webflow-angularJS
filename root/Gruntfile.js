/*global module:false*/

module.exports = function(grunt) {

  'use strict';
  
  var scriptsToAddHead = grunt.file.read('app/views/includes/headScripts.html');
  var scriptsToAddBody = grunt.file.read('app/views/includes/bodyScripts.html');
  var webflowScript = grunt.file.read('app/views/includes/webflowScript.html');

  // Read webflow settings 
  var webflowConfigs = grunt.file.readJSON('_grunt_configs/webflow.json');

  var options = {

    // Server Config
    devPort: 9009,
    devHostname: 'localhost',

    // Project Directories
    site: '_site',
    webflow_temp_dir: 'webflow',
    webflow_templates: 'webflow/templates',
    webflow_raw_zip_folder: webflowConfigs.downloadZipDir,

    // File Prefixes
    webflow_template_class_prefix: 'template_',

    // Important Files
    webflow_zip: webflowConfigs.appName + '.webflow.zip'
  },
  opt = options;

  grunt.initConfig({

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      },
      app_code: {
        src: 'app/**/*.js'
      }
    },
  
    nodeunit: {
      files: ['test/**/*_test.js']
    },

    'unzip': {
      webflow: {
        src: 'temp' + '/' + opt.webflow_zip, 
        dest: opt.webflow_temp_dir 
      },
    },  
    // _______________________________

    clean: {
      webflow_zip: {
        src: [opt.webflow_temp_dir + '/' + opt.webflow_zip]
      },
      webflow_raw: {
        src: [opt.webflow_temp_dir]
      },
      // webflow_downloaded_zip: {
      //   options: {
      //     force: true,
      //   },
      //   src: [opt.webflow_raw_zip_folder + '/' + opt.webflow_zip]
      // },
      temp: {
        src: ['temp']
      },
    },

    dom_munger: {

      add_remove_stuff: {
        options: {
          //You typically would only specify one option per target but they may be combined
          //All options (except callback) can be arrays
          append: [
            {selector:'head',html:scriptsToAddHead},
            {selector:'body',html:scriptsToAddBody}
          ],
          remove: '.mockmeup',
          callback: function($){
            $('html').removeAttr( "data-wf-site" );
          },
        },
        src: opt.webflow_temp_dir + '/index.html',// <%= webflow_temp_dir %>/index.html', //could be an array of files
      },

      extract_templates: {
        options: {
          callback: function($) {
  
            var fs = require('fs');
            var templateFolder = opt.webflow_templates;

            grunt.file.mkdir(templateFolder);

            $(".template").each(function () {
              var templateName = $(this).attr("id");
              fs.writeFileSync(templateFolder + '/' + templateName + '.html',$(this) + webflowScript); 
            });

          },
        },
        src: opt.webflow_temp_dir + '/index.html'  //could be an array of files
        // TODO: make work for multi page, not just index
      }, 

      translate_directives: {

        options: {

          callback: function($){

            grunt.log.writeln("start: dom_munger:translate_directives");
            var directives = $('.directive');

            directives.each(function () {
              var directiveId = $(this).attr('id');
              $(this).replaceWith("<div " + directiveId + "></div>");
              // $(this).replaceWith("<" + directiveId + "></" + directiveId + ">");
            });
   
          },
        },
        src: opt.webflow_temp_dir + '/index.html'  //could be an array of files
      },
    },
    // _______________________________
    
    copy: {

      // TODO: add message and logic to stop upon no zip file found
      webflow_zip_to_temp: {
        expand: true,
        cwd: opt.webflow_raw_zip_folder, 
        src: opt.webflow_zip,
        dest: 'temp/'
      },

      webflow_raw_to_site: {
        expand: true,
        cwd: opt.webflow_temp_dir, 
        src: ['**'],
        dest: opt.site
      },

      app_to_site_js: {
        expand: true,
        flatten: true, 
        cwd: 'app', 
        src: ['**/*.js'],
        dest: opt.site + '/js'
      },

      scripts_to_site_js: {
        expand: true,
        flatten: true, 
        cwd: 'content/scripts', 
        src: ['**/*.js'],
        dest: opt.site + '/js'
      },

      cs_to_site_cs: {
        expand: true,
        flatten: true, 
        cwd: 'content/css', 
        src: ['**/*.cs'],
        dest: opt.site + '/cs'
      },
      // TODO: Copy a file that contains some diagnostic data into the _site, type of build, date, etc
    },
  
    // _______________________________

    // TODO: Have site regenerate upon a new zip file being downloaded,  
    //       Need to get 'watch' working for external directory, maybe a bug in OSX at least.

     watch: {

      webflow_downloads: {
        files: opt.webflow_zip, // careful with the spaces after a variable 
        tasks: ['webflow'], // * If it's a registered task, wrap it in [], a single one like 'clean:webflow_zip', DON'T
        options: { 
          event: ['added'],
          cwd: { 
            files: opt.webflow_raw_zip_folder,
            // spawn: 'but/spawn/files/from/here' 
          } 
          // spawn : false,
          // interrupt: true, 
        },
      },
      
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },

      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'nodeunit']
      },

      app_code: {
        files: '<%= jshint.app_code.src %>',
        // tasks: ['jshint:app_code']
        // TODO: Help jshint find undefined stuff, for now just copy it to _site
        tasks: ['copy:app_to_site_js']
      }
    },
    // _______________________________

    touch: {
      options: {
        force: true,
        mtime: false
      },
      src: [opt.webflow_raw_zip_folder + '/' + opt.webflow_zip],
    },
    // _______________________________

    connect: {
      server: {
        options: {
          hostname: opt.devHostname,
          port: opt.devPort,
          base: opt.site
        }
      },
    },

    concat: {   
      dist: {
          src: [
              'app/**/*.js' 
          ],
          dest: opt.site + '/js/production.js',
      },
    }

  });

  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-dom-munger');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // TODO: Tidy up and compact things
  // grunt.loadNpmTasks('grunt-contrib-concat');

  // TODO: Why not just pull everything from a published site..
  // grunt.loadNpmTasks('grunt-curl');

  // _________

  // TODO: see if some combo of tasks can help with watching downloads directory, keep an eye on github, maybe it's a bug
  // grunt.loadNpmTasks('grunt-touch'); 
  // grunt.loadNpmTasks('grunt-html2js');
  // grunt.loadNpmTasks('grunt-newer');

  // Needed because watch seems kinda dumb, only will watch for addition if the file exhists initially, so maybe I create it and destroy it???
  // grunt.registerTask('watchme', ['touch', 'watch:webflow_downloads', 'clean:webflow_downloaded_zip']);
  // grunt.registerTask('touchwatch', ['touch', 'watch:webflow_downloads']);
  // grunt.registerTask('watch', ['touch', 'watch:webflow_downloads']);
  // grunt.registerTask('watchme', ['watch:webflow_downloads']);

  // _________

  grunt.registerTask('default', ['jshint', 'nodeunit']);

  grunt.registerTask('copy_to_site', ['copy:webflow_raw_to_site','copy:app_to_site_js', 'copy:scripts_to_site_js']);

  // bash alias: gs
  grunt.registerTask('serve', ['connect:server', 'watch']); 
  // server will stop unless watching..

  grunt.registerTask('webflow', ['copy:webflow_zip_to_temp', 'unzip:webflow', 'dom_munger', 'copy_to_site', 'clean', 'serve']);

};
