requirejs.config({
	baseUrl: 'js',
	paths: {
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min',
		// 'jquery.ui': '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/jquery-ui.min',
		// 'jquery.jqtree': 'lib/jqtree/tree.jquery',
		'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min',
		'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
		// 'backbone.localstorage': '//cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.1.0/backbone.localStorage-min',
		'text': '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text',
		'mustache': '//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.7.2/mustache.min'
	},
	shim: {
		// 'jquery.ui': ['jquery'],
		// 'jquery.jqtree': ['jquery'],
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		// 'backbone.localstorage': ['backbone'],
		'app': ['underscore', 'backbone']
	}
});

require(['backbone', 'd_video'], function(Backbone, DVideo) {
	window.dVideo = new DVideo();
	window.dVideo.start();
});