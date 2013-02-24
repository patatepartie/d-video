module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.initConfig({
		requirejs: {
			compile: {
				options: {
					appDir: 'app',
					baseUrl: 'js',
					paths: {},
					dir: 'target',
					modules: [{name: 'main'}]
				}
			}
		}
	});

	grunt.registerTask('default', 'requirejs');
}