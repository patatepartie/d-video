define(['backbone'], function(Backbone) {
    function timeToSeconds(time) {
        var components = time.split(":").map(function(item) {
            return parseInt(item, 10);
        });
        return ((components[0] * 60) + components[1]) * 60 + components[2]; 
    }
    
	var Section = Backbone.Model.extend({
		defaults: {
			id: '-1', 
			title: '', 
			description: '', 
			start: '00:00:00', 
			end: '00:00:00'
		},
        
        getStartInSeconds: function() {
            return timeToSeconds(this.get('start'));   
        },
        
        getEndInSeconds: function() {
            return timeToSeconds(this.get('end'));
        }
	});
	
	return Section;
});