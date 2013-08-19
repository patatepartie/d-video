define([
    'backbone',
	'server',
	'views/app',
	'views/media',
    'views/showing',
    'views/mediumLoader',
    'views/player',
    'views/seeker',
    'views/progress',
    'views/play',
    'views/speed',
    'views/chapters',
    'models/video',
    'collections/media',
    'collections/chapterList',
	'config'],
	
	function(Backbone, Server, AppView, MediaView, ShowingView, MediumLoadingView, PlayerView, SeekerView, ProgressView, PlayView, SpeedView, ChaptersView, Video, Media, ChapterList) {
		var App = function() {
			var self = this;

            var media = new Media();
                        
            // self.models.activeMedium = self.collections.media.first();
            self.models.video = new Video();
			
			self.views.app = new AppView(self);
			self.views.app.render();
            
            self.views.videoLoader = new MediumLoadingView({model: self.models.video});
            self.views.videoLoader.render();
            
            self.views.video = new PlayerView({model: self.models.video});
            self.views.video.render();
            
            self.views.seeker = new SeekerView({model: self.models.video});
            self.views.seeker.render();
            
            self.views.progress = new ProgressView({model: self.models.video});
            self.views.progress.render();
            
            self.views.play = new PlayView({model: self.models.video});
            self.views.play.render();
            
            self.views.speed = new SpeedView({model: self.models.video});
            self.views.speed.render();
            
			self.views.media = new MediaView({collection: media});
			self.views.media.render();
            
            self.views.showing = new ShowingView();
            self.views.showing.render();
            
            self.views.chapters = new ChaptersView({collection: new ChapterList({mediumId: '-1'})});
            self.views.chapters.render();
            
            Backbone.on('medium:selected', function(mediumSelected) {
                var chapterList = new ChapterList({mediumId: mediumSelected.get('id')});
                
                self.views.chapters.remove();
                
                self.views.chapters = new ChaptersView({collection: chapterList});
                self.views.chapters.render();
                
                chapterList.fetch();
            });
            
            media.fetch();
		};
	
		App.prototype = {
				views: {},
				collections: {},
				models: {}
		};
	
		return App;
	}
);
