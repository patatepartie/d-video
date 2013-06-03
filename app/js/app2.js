define([
    'backbone',
    'jquery',
    'views/contentLoader', 
    'views/descriptions',
    'views/player',
    'models/content', 
    'collections/descriptions'],
    
    function(Backbone, $, ContentLoadingView, DescriptionsListView, PlayerView, Content, DescriptionsList) {
		var AppRouter = Backbone.Router.extend({
            routes: {
                "": "descriptionsLoading"
            },
            
            models: {},
            collections: {},
            views: {},
            
            initialize: function() {
                this.models.content = new Content();
                this.views.contentLoading = new ContentLoadingView({el: "#mediaFileLoader", model: this.models.content}).render();
                
                this.views.player = new PlayerView({el: '#content', model: this.models.content}).render();
                // Load other static contents (media content view ?)
            },
            
            descriptionsLoading: function() {
                var self = this;
                
                this.collections.descriptionsList = new DescriptionsList();
                this.collections.descriptionsList.fetch({success: function() {
                    this.views.descriptions = new DescriptionsListView({el: '#descriptionsList',collection: self.collections.descriptionsList}).render();
                }});                
            }
		});
	
		return AppRouter;
	}
);
