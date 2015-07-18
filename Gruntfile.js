module.exports = function(grunt) {
  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['test/**/*.js']
      }
    },    
    uglify: {
      my_target: {
        files: {
          'builder-decorator.min.js': ['src/builder-decorator.js']
        }
      },
      options: {
        preserveComments: 'some'
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-uglify'); // load the given tasks
  grunt.registerTask('default', ['uglify']); // Default grunt tasks maps to grunt
  grunt.registerTask('build', []);
  grunt.registerTask('test', 'mochaTest');
};