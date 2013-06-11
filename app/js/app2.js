define([
    'backbone',
    'jquery',
    'views/contentLoader', 
    'views/descriptions',
    'views/player',
    'views/play',
    'views/seeker',
    'views/progress',
    'views/speed',
    'views/description',
    'models/content', 
    'collections/descriptions',
    'collections/description'],
    
    function(Backbone, $, ContentLoadingView, DescriptionsListView, PlayerView, PlayControlView, SeekerView, ProgressView, SpeedView, DescriptionView, Content, DescriptionsList, Description) {
		var AppRouter = Backbone.Router.extend({
            routes: {
                "": "descriptionsLoading",
                "media/:media": "selectDescription"
            },
            
            models: {},
            collections: {},
            views: {},
            
            initialize: function() {
                this.models.content = new Content();
                this.collections.descriptionsList = new DescriptionsList();
                
                this.views.contentLoading = new ContentLoadingView({el: "#mediaFileLoader", model: this.models.content}).render();
                this.views.descriptions = new DescriptionsListView({el: '#descriptionsList', collection: this.collections.descriptionsList}).render();
                this.views.player = new PlayerView({el: '#content', model: this.models.content}).render();
                this.views.playControl = new PlayControlView({el: '#player .play', model: this.models.content}).render();
                this.views.seeker = new SeekerView({el: '#player .seeker', model: this.models.content}).render();
                this.views.progress = new ProgressView({el: '#player .progress', model: this.models.content}).render();
                this.views.speed = new SpeedView({el: '#player .speed', model: this.models.content}).render();
                
                Backbone.on('description:selected', this.showDescription, this);
                
                // Load other static contents (media content view ?)
            },
            
            descriptionsLoading: function() {
                this.collections.descriptionsList.fetch();                
            },
            
            selectDescription: function(id) {
                this.collections.descriptionsList.fetch({success: function() {
                    $('#descriptionsList select').val(id).change();
                }});                
            },
            
            showDescription: function(descriptionId) {
                var self = this;
                
                if (self.views.description) {
                    self.views.description.remove();
                }
                
                self.collections.currentDescription = new Description({mediumId: descriptionId});
                
                self.collections.currentDescription.fetch({success: function() {
                    self.views.description = new DescriptionView({el: '#description', collection: self.collections.currentDescription}).render();    
                }});                
            }
		});
        
		return AppRouter;
	}
);
