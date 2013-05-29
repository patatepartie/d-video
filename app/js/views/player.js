define(['backbone'], function(Backbone) {
	var PlayerView = Backbone.View.extend({
		el: '#video1',
        
        events: {
            'timeupdate': 'onTimeUpdate',
            'durationchange': 'onDurationChange'
        },
				
		initialize: function(options) {
            this.model.on('change:url', this.loadMedium, this);
            this.model.on('change:currentTime', this.changeCurrentTime, this);
		},
        
        loadMedium: function() {
            var medium = this.$el.get(0);
            medium.src = this.model.get('url');
        },
        
        changeCurrentTime: function() {
            this.el.currentTime = this.model.get('currentTime');
        },
        
        onTimeUpdate: function () {
			var time = this.el.currentTime;			
			this.model.set({currentTime: time});
		},
        
        onDurationChange: function () {
            var duration = this.el.duration;			
			this.model.set({duration: duration});
		}
	});
	
	return PlayerView;
});