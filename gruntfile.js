const sass = require('node-sass');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // uglify
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        // src: 'src/<%= pkg.name %>.js',
        // dest: 'min/<%= pkg.name %>.min.js',
        files: {
          'dist/js/all.min.js': [
            'js/vendor/modernizr-3.8.0.min.js', 
            'js/plugins.js',
            'js/main.js'
          ] // src/**/*.js
        }
      }
    },
    // include replace
    // @@include('header.html', {"name": "Joe Bloggs"})
    // <p>Hello @@name!</p>
    includereplace: {
      dist: {
        options: {
          globals: {}, // Global variables available for replacement in all files.
          // prefix: '<!-- @@', // Variable/include directive prefix. Careful when changing as it is added to the regular expression used for finding variables to be replaced.
          // suffix: ' -->', // Variable/include directive suffix. Careful when changing as it is added to the regular expression used for finding variables to be replaced.
          includesDir: 'inc/' // Directory where includes will be resolved.
        },
        src: '*.html',
        dest: 'dist/'
      },
    
      // compile less stylesheets to css -----------------------------------------
      less: {
          build: {
            files: {
              'dist/css/pretty.css': 'src/css/pretty.less'
            }
          }
      },
        
      // configure cssmin to minify css files ------------------------------------
      cssmin: {
          options: {
            banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
          },
          develop: {
            files: {
                expand: true,
                cwd: '../../EULOGOS/corte-costituzionale/html/assets/css',
                src: ['*.css', '!*.min.css'],
                dest: 'release/css',
                ext: '.min.css'
            }
          },
          build: {
            files: {
              'dist/css/style.min.css': 'src/css/style.css'
            }
          }
      },
    
      // for scripts, run jshint and uglify 
      scripts: { 
        files: 'js/*.js', tasks: ['jshint', 'uglify'] 
      } 
    },

    // sass compiling ------------------------------------------
    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      dist: {
        files: {
          'dist/css/main.css': 'scss/main.scss'
        }
      }
    },
      
    // copy files ------------------------------------------
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true, 
            src: ['**'], 
            dest: 'dist/webfonts',
            cwd: 'node_modules/@fortawesome/fontawesome-free/webfonts/' 
          },
          {
            expand: true, 
            src: ['**'], 
            dest: 'dist/img',
            cwd: 'img/' 
          },

          // includes files within path and its sub-directories
          //{expand: true, src: ['path/**'], dest: 'dest/'},

          // makes all src relative to cwd
          //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

          // flattens results to a single level
          //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
        ],
      },
    },
      
    // clean folders ------------------------------
    clean: {
      build: ['dist']
    },
        
    // HTML minifier ------------------------------
    htmlcompressor: {
      compile: {
        files: [{
          expand: true,     // Enable dynamic expansion.
          cwd: 'src/',      // Src matches are relative to this path.
          src: ['**/*.html'], // Actual pattern(s) to match.
          dest: 'dest/',   // Destination path prefix.
        }],
        options: {
          type: 'html',
          preserveServerScript: true
        }
      }
    },
      
    // make a zipfile  ------------------------------
    compress: {
      main: {
        options: {
          archive: 'archive.zip'
        },
        files: [
          {src: ['path/*'], dest: 'internal_folder/', filter: 'isFile'}, // includes files in path
          {src: ['path/**'], dest: 'internal_folder2/'}, // includes files in path and its subdirs
          {expand: true, cwd: 'path/', src: ['**'], dest: 'internal_folder3/'}, // makes all src relative to cwd
          {flatten: true, src: ['path/**'], dest: 'internal_folder4/', filter: 'isFile'} // flattens results to a single level
        ]
      }
    },
        
    /**
     * SFTP Deploy
     * @see https://github.com/thrashr888/grunt-sftp-deploy#authentication-parameters 
     */
    'sftp-deploy': {
      build: {
        auth: {
          host: 'server.com',
          port: 22,
          authKey: 'key1'
        },
        cache: 'sftpCache.json',
        src: '/path/to/source/folder',
        dest: '/path/to/destination/folder',
        exclusions: ['/path/to/source/folder/**/.DS_Store', '/path/to/source/folder/**/Thumbs.db', 'dist/tmp'],
        serverSep: '/',
        localSep: '/',
        concurrency: 4,
        progress: true
      }
    }
    
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');
  //grunt.loadNpmTasks('grunt-include-includereplace');

  // Default task(s).
  grunt.registerTask('default', ['clean','uglify','sass','includereplace','copy']);

};