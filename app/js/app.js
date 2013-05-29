define([
	'jquery',
	'server',
	'views/app',
	'views/media',
    'views/showing',
    'views/mediumLoader',
    'views/medium',
	'models/medium',
    'models/video',
	'config'],
	
	function($, Server, AppView, MediaView, ShowingView, MediumLoadingView, MediumView, Medium, Video) {
		var App = function() {
			var self = this;
			
			self.server = new Server(self);
			self.server.startupSync(function() {
				self.models.activeMedium = self.collections.media.first();
                self.models.video = new Video();
				
				self.views.app = new AppView(self);
				self.views.app.render();
                
                self.views.videoLoader = new MediumLoadingView({model: self.models.video});
                self.views.videoLoader.render();
                
                self.views.video = new MediumView({model: self.models.video});
                self.views.video.render();
				
				self.views.media = new MediaView({models: self.models, collection: self.collections.media, sections: self.collections.sections});
				self.views.media.render();
                
                self.views.showing = new ShowingView();
                self.views.showing.render();
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
