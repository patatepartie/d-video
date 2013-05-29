define(['backbone'], function(Backbone) {
	var PlayerView = Backbone.View.extend({
		el: '#video1',
        
        events: {
            'timeupdate': 'onTimeUpdate'
        },
				
		initialize: function(options) {
            this.model.on('change:url', this.loadMedium);     
            this.model.view = this;
		},
        
        loadMedium: function() {
            var medium = this.view.$el.get(0);
            medium.src = this.get('url');
        },
        
        onTimeUpdate: function () {
			var time = this.el.currentTime;			
			this.model.set({currentTime: time});
		},
	});
	
	return PlayerView;
});