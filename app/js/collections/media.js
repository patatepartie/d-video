define(['backbone.localstorage', 'models/medium'], function(Medium) {
	var Media = Backbone.Collection.extend({
		model: Medium,
		localStorage: new Backbone.LocalStorage("media")
	});
	
	return Media;
});