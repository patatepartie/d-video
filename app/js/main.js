requirejs.config({
	baseUrl: 'js',
	paths: {
		'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
		'jquery.ui': 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/jquery-ui.min',
		'jquery.jqtree': 'lib/jqtree/tree.jquery'
	},
	shim: {
		'jquery.ui': ['jquery'],
		'jquery.jqtree': ['jquery']
	}
});

require(['app'], function(App) {
	window.dVideo = new App();
});