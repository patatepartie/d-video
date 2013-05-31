define(['backbone', 'views/contentLoader', 'models/content'], function(Backbone, ContentLoadingView, Content) {
		var AppRouter = Backbone.Router.extend({
            routes: {
                "": "descriptionsLoading"
            },
            
            initialize: function() {
                this.mediaContent = new Content();
                
                this.contentLoadingView = new ContentLoadingView({el: "#mediaFileLoader", model: this.mediaContent});
                this.contentLoadingView.render();
                // Load other static contents
            },
            
            descriptionsLoading: function() {
            }
		});
	
		return AppRouter;
	}
);
