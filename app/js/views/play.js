define(['backbone', 'underscore', 'text!templates/play.html'], function(Backbone, _, templateFile) {
	var PlayView = Backbone.View.extend({
        template: _.template(templateFile),
        tagName: 'button',
        
		events: {
            'click': 'onClick'
        },
				
		initialize: function(options) {
            this.$el.attr("disabled", "disabled");
            this.listenTo(this.model, 'change:url', this.enable);
		},
        
        render: function() {
            this.$el.html(this.template());
            
            return this;
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