define([
    'backbone',
    'jquery',
    'views/contentLoader', 
    'views/descriptions',
    'views/player',
    'views/play',
    'models/content', 
    'collections/descriptions'],
    
    function(Backbone, $, ContentLoadingView, DescriptionsListView, PlayerView, PlayControlView, Content, DescriptionsList) {
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
                // Load other static contents (media content view ?)
            },
            
            descriptionsLoading: function() {
                this.collections.descriptionsList.fetch();                
            },
            
            selectDescription: function(id) {
                this.collections.descriptionsList.fetch({success: function() {
                    $('#descriptionsList select').val(id).change();
                }});                
            }
		});
	
		return AppRouter;
	}
);
