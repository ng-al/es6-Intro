module.exports = function(grunt) {
    grunt.initConfig({
        exec: {
            babel: 'for filename in tests/*/*.es6 tests/lib/*/*.es6; do babel "${filename}" --out-file "${filename}-transpiled.js"; done'
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.registerTask("default", "run-tests");
    grunt.registerTask("run-tests", ["transpile", "karma"]);
    grunt.registerTask("transpile", "exec:babel");

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-karma');
};