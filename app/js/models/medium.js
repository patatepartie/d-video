define(function() {
	var Medium = Backbone.Model.extend({
		defaults: {
			id: "-1",
			title: "Choose one...",
			duration: "00:00:00"
		}
	});
	
	return Medium;
});