requirejs.config({
	baseUrl: 'js',
	paths: {
		'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
		'jquery.ui': 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/jquery-ui.min',
		'jquery.jqtree': 'lib/jqtree/tree.jquery',
		'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
		'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min',
		'backbone-localstorage': '//cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.1.0/backbone.localStorage-min'
	},
	shim: {
		'jquery.ui': ['jquery'],
		'jquery.jqtree': ['jquery'],
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'backbone'
		},
		'backbone-localstorage': ['backbone']
	}
});

require(['app'], function(App) {
	window.dVideo = new App();
});