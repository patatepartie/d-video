define(['jquery', 'views/app', 'models/medium', 'collections/media'], function($, AppView, Medium, Media) {
	var App = function() {
		var self = this;
		
		$.getJSON("/media", function(data) {
			self.collections.media = new Media();
			
			data.forEach(function(rawMedium) {
				var medium = new Medium(rawMedium);
				self.collections.media.add(medium);
			});
			
			$.getJSON("/sections", function(data) {
				localStorage.setItem("sections", JSON.stringify(data));

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
