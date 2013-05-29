define([], function() {
	var MediumView = window.Backbone.View.extend({
		el: '#video1',
				
		initialize: function(options) {
            this.model.on('change:url', this.loadMedium);     
            this.model.view = this;
		},
        
        loadMedium: function() {
            var mediumContainer = this.view.$el.get(0);
            mediumContainer.src = this.get('url');            
        }
	});
	
	return MediumView;
});