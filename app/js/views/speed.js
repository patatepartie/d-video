define(['backbone'], function(Backbone) {
	var SpeedView = Backbone.View.extend({
		el: '#speed',
        
        events: {
            'slide': 'onSlide'
        },
				
		initialize: function(options) {
            this.$el.slider({
                orientation: "vertical",
                range: "min",
				min: 0,
				max: 3,
				step: 0.5,
				value: 1,
                disabled: true});
                
            this.model.on('change:duration', this.enable, this);
		},
    
        enable: function() {
            this.$el.slider("option", "disabled", false);
            this.$el.slider("value", 1);
        },
        
        onSlide: function(event, ui) {
            this.model.set({speed: ui.value});
        }
	});
	
	return SpeedView;
});