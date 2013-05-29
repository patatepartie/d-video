define(['models/section'], function(Section) {
	var ShowingView = Backbone.View.extend({
		el: '#chapter',
		
		events: {
		},
		
		initialize: function(options) {
		},
		
		render: function() {
			var self = this,
				$el = $(self.el);

            $el.hide();
            
			return this;
		}
	});
	
	return ShowingView;
});