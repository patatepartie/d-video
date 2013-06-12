define(['backbone', 'models/section'], function(Backbone, Section) {
	var Sections = Backbone.Collection.extend({
		model: Section,
        
        initialize: function(options) {
            this.descriptionId = options.descriptionId;    
        },
        
        url: function() {
            return '/media/' + this.descriptionId + '/chapters';
        }
	});
	
	return Sections;
});