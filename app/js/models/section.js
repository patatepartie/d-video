define(function() {
	var Section = Backbone.Model.extend({
		defaults: {
			id: '-1', 
			title: '', 
			description: '', 
			start: '00:00:00', 
			end: '00:00:00'
		}
	});
	
	return Section;
});