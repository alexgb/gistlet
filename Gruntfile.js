var UglifyJS = require("uglify-js");

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-ejs');
  grunt.initConfig({
    ejs: {
      all: {
        src: ['src/index.html.ejs'],
        dest: 'public/index.html',
        options: {
          makeBookmarklet: function(src) {
            var code = UglifyJS.minify(src).code;
            return encodeURIComponent(code);
          }
        }
      }
    }
  });


  grunt.registerTask('default', ['ejs']);
};
