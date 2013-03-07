define(['backbone.localstorage', 'models/section'], function(Section) {
	var Sections = Backbone.Collection.extend({
		model: Section,
		localStorage: new Backbone.LocalStorage("sections")
	});
	
	return Sections;
});