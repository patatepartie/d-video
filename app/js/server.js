define(['jquery', 'models/medium', 'collections/media', 'models/section', 'collections/sections'], function($, Medium, Media, Section, Sections) {
	var Server = function(app) {
		this.app = app;
	};
	
	Server.prototype = {
		startupSync: function(callback) {
			var collections = this.app.collections;
			
			$.getJSON("/media", function(data) {
				collections.media = new Media();
				
				data.forEach(function(rawMedium) {
					var medium = new Medium(rawMedium);
					collections.media.add(medium);
				});
				
				$.getJSON("/sections", function(data) {
					collections.sections = new Sections();
					
					data.forEach(function(rawSection) {
						var section = new Section(rawSection);
						collections.sections.add(section);
					});
					
					callback();					
				});
			});
		}
	};
	
	return Server;
});