define(['backbone', 'models/medium'], function(Backbone, Medium) {
	var DescriptionsList = Backbone.Collection.extend({
		model: Medium,
        url: '/media',

		findById: function(mediumId) {
			return this.find(function(medium) {
				return medium.get("id") === mediumId;
			});
		}
	});
	
	return DescriptionsList;
});