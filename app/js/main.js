requirejs.config({
	baseUrl: 'js',
	paths: {

	},
	shim: {

	}
});

require(['app'], function(App) {
	window.dVideo = new App();
});