define(['backbone.localstorage', 'models/medium'], function(Medium) {
	var Media = Backbone.Collection.extend({
		model: Medium,
		localStorage: new Backbone.LocalStorage("media"),

		findById: function(mediumId) {
			return this.find(function(medium) {
				return medium.get("id") === mediumId;
			});
		}
	});
	
	return Media;
});