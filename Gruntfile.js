module.exports = function(grunt) {
    grunt.initConfig({
        exec: {
            babel: 'for filename in samples/*.es6 tests/*/*.es6 tests/class/*/*.es6 tests/lib/*/*.es6; do babel "${filename}" --out-file "${filename}-transpiled.js"; done'
        },
        karma: {
            chrome: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.registerTask("default", "run-tests");
    grunt.registerTask("run-tests", ["transpile", "karma:chrome"]);
    grunt.registerTask("transpile", "exec:babel");

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-karma');
};