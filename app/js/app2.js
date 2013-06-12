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
    'collections/sections'],
    
    function(Backbone, $, ContentLoadingView, DescriptionsListView, PlayerView, PlayControlView, SeekerView, ProgressView, SpeedView, DescriptionView, Content, DescriptionsList, Sections) {
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
                
                $('#mediaFileLoader').html(new ContentLoadingView({model: this.models.content}).render().el);
                $('#descriptionsList').html(new DescriptionsListView({collection: this.collections.descriptionsList}).render().el);
                $('#content').html(new PlayerView({model: this.models.content}).render().el);
                $('#player .play').html(new PlayControlView({model: this.models.content}).render().el);
                $('#player .seeker').html(new SeekerView({model: this.models.content}).render().el);
                $('#player .progress').html(new ProgressView({model: this.models.content}).render().el);
                $('#player .speed').html(new SpeedView({model: this.models.content}).render().el);

                Backbone.on('description:selected', this.showDescription, this);
            },
            
            descriptionsLoading: function() {
                this.collections.descriptionsList.fetch();                
            },
            
            selectDescription: function(id) {
                this.collections.descriptionsList.fetch({success: function() {
                    $('#descriptionsList select').val(id).change();
                }});                
            },
            
            showDescription: function(description) {
                var self = this,
                    descriptionId;
                
                if (self.views.description) {
                    self.views.description.remove();
                    delete self.views.description;
                }
                
                if (description) {
                    descriptionId = description.get('id');

                    this.navigate("media/" + descriptionId);
                    
                    self.collections.currentSections = new Sections({descriptionId: descriptionId});
                    
                    self.collections.currentSections.fetch({success: function() {
                        self.views.description = new DescriptionView({collection: self.collections.currentSections, model: description});
                        $('#description .content').html(self.views.description.render().el);
                    }});    
                } else {
                    this.navigate("media");
                }
                
            }
		});
        
		return AppRouter;
	}
);
