requirejs.config({
	baseUrl: 'js',
	paths: {
		'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
		'jquery.ui': 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/jquery-ui.min',
		'jquery.jstree': 'lib/jstree/jquery.jstree'

	},
	shim: {
		'jquery.ui': ['jquery'],
		'jquery.jstree': ['jquery']
	}
});

require(['app'], function(App) {
	window.dVideo = new App();
});