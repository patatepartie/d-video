requirejs.config({
	baseUrl: 'js',
	paths: {
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min',
		'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min',
		'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
		'backbone.validation': '//raw.github.com/thedersen/backbone.validation/master/dist/backbone-validation',
		'text': '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text',
		'mustache': '//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.7.2/mustache.min'
	},
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'backbone.validation': ['backbone'],
		'd_video': ['underscore', 'backbone', 'backbone.validation']
	}
});

require(['backbone', 'd_video'], function(Backbone, DVideo) {
	window.dVideo = new DVideo();
	window.dVideo.start();
});