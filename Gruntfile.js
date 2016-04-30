module.exports = function(grunt) {
    grunt.initConfig({
        exec: {
            babel: 'for filename in tests/*/*.es6 tests/lib/*/*.es6; do babel "${filename}" --out-file "${filename}-transpiled.js"; done'
        },
        karma: {
            chrome: {
                configFile: 'proxyKarma.conf.js'
            },
            phantom: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.registerTask("default", "run-all-tests");
    grunt.registerTask("run-all-tests", ["transpile", "karma:phantom", "karma:chrome"]);
    grunt.registerTask("run-most-tests", ["transpile", "karma:phantom"]);
    grunt.registerTask("run-proxy-tests", ["transpile", "karma:chrome"]);
    grunt.registerTask("transpile", "exec:babel");

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-karma');
};