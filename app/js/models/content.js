define(['backbone'], function(Backbone) {
	var MediaContent = Backbone.Model.extend({
        defaults: {
            playing: false,
            currentTime: 0,
            seekedTime: 0,
            duration: 0,
            speed: 1
        },
        
        togglePlay: function() {
            this.set({playing: !this.get('playing')});
        }
	});
	
	return MediaContent;
});