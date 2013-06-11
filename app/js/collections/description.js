define(['backbone', 'models/section'], function(Backbone, Section) {
	var Description = Backbone.Collection.extend({
		model: Section,
        
        initialize: function(options) {
            this.mediumId = options.mediumId;    
        },
        
        url: function() {
            return '/media/' + this.mediumId + '/chapters';
        }
	});
	
	return Description;
});