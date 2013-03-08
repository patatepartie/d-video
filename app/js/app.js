define([
	'jquery',
	'server',
	'views/app',
	'views/media',
	'models/medium',
	'config'],
	
	function($, Server, AppView, MediaView, Medium) {
		var App = function() {
			var self = this;
			
			self.server = new Server(self);
			self.server.startupSync(function() {
				self.models.activeMedium = self.collections.media.first();
				
				self.views.app = new AppView(self);
				self.views.app.render();
				
				self.views.media = new MediaView({models: self.models, collection: self.collections.media, sections: self.collections.sections});
				self.views.media.render();
			});
		};
	
		App.prototype = {
				views: {},
				collections: {},
				models: {}
		};
	
		return App;
	}
);
