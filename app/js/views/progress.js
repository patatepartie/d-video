define(['backbone'], function(Backbone) {
    function secondsToTime(timeInSeconds) {
        var hours = parseInt(timeInSeconds / 3600, 10) % 24,
			minutes = parseInt(timeInSeconds / 60, 10) % 60,
			seconds = parseInt(timeInSeconds, 10) % 60;
		
		return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
	}
    
	var ProgressView = Backbone.View.extend({
		initialize: function(options) {
            this.listenTo(this.model, 'change:currentTime', this.updateTime);
		},
        
        updateTime: function() {
            this.$el.text(secondsToTime(this.model.get('currentTime')));
        }
	});
	
	return ProgressView;
});