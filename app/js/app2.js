define([
    'backbone',
    'jquery',
    'views/contentLoader', 
    'views/descriptions',
    'views/player',
    'models/content', 
    'collections/descriptions',
    'config'],
    
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
                    $('#descriptionsList').html(new DescriptionsListView({collection: self.collections.descriptionsList}).render().el);
                }});                
            }
		});
	
		return AppRouter;
	}
);
