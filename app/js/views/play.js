define(['backbone'], function(Backbone) {
	var PlayView = Backbone.View.extend({
		events: {
            'click': 'onClick'
        },
				
		initialize: function(options) {
            this.$el.attr("disabled", "disabled");
            this.listenTo(this.model, 'change:url', this.enable);
		},
        
        onClick: function(event) {
            this.model.togglePlay();
        },
        
        enable: function() {
            this.$el.removeAttr("disabled");
        }
	});
	
	return PlayView;
});