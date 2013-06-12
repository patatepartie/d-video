define(['backbone', 'underscore', 'text!templates/player.html'], function(Backbone, _, templateFile) {
	var PlayerView = Backbone.View.extend({
        template: _.template(templateFile),
        tagName: 'video',
        
        events: {
            'timeupdate': 'onTimeUpdate',
            'durationchange': 'onDurationChange'
        },
				
		initialize: function(options) {
            this.listenTo(this.model, 'change:url', this.loadMedium);
            this.listenTo(this.model, 'change:seekedTime', this.changeCurrentTime);
            this.listenTo(this.model, 'change:playing', this.togglePlaying);
            this.listenTo(this.model, 'change:speed', this.changeSpeed);
		},
        
        render: function() {
            this.$el.html(this.template());
            
            return this;
        },
        
        loadMedium: function() {
            this.el.src = this.model.get('url');
        },
        
        changeCurrentTime: function() {
            this.el.currentTime = this.model.get('seekedTime');
        },
        
        changeSpeed: function() {
            this.el.playbackRate = this.model.get('speed');
        },
        
        togglePlaying: function() {
            if (this.model.get('playing')) {
                this.el.play();
            } else {
                this.el.pause();
            }
        },
        
        onTimeUpdate: function () {
			var time = this.el.currentTime;			
			this.model.set({currentTime: time});
		},
        
        onDurationChange: function () {
            var duration = this.el.duration;			
			this.model.set({duration: duration});
            this.model.set({playing: false});
		}
	});
	
	return PlayerView;
});