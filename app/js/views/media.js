define(['text!templates/medium.html'], function(template) {
	var MediaView = Backbone.View.extend({
		el: '#mediaList',
		tagName: 'select',
		template: _.template(template),
		
		events: {
			
		},
		
		initialize: function() {
		},
		
		render: function() {
			var self = this,
				$el = $(self.el);
			
			self.collection.forEach(function(medium) {
				$el.append(self.template(medium.toJSON()));
			});
			
			return this;
		}
	});
	
	return MediaView;
});