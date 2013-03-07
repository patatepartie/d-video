define(['jquery', 'views/app', 'models/medium', 'collections/media', 'models/section', 'collections/sections'], function($, AppView, Medium, Media, Section, Sections) {
	var App = function() {
		var self = this;
		
		$.getJSON("/media", function(data) {
			self.collections.media = new Media();
			
			data.forEach(function(rawMedium) {
				var medium = new Medium(rawMedium);
				self.collections.media.add(medium);
			});
			
			$.getJSON("/sections", function(data) {
				self.collections.sections = new Sections();
				
				data.forEach(function(rawSection) {
					var section = new Section(rawSection);
					self.collections.sections.add(section);
				});
				
				self.views.app = new AppView(self);
				self.views.app.render();
				
			});
		});
	};

	App.prototype = {
			views: {},
			collections: {}
	};

	return App;
});
