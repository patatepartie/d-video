define(['backbone'], function(Backbone) {
	var SeekerView = Backbone.View.extend({
		el: '#seeker',
        
        events: {
            'slide': 'onSlide'
        },
				
		initialize: function(options) {
            this.$el.slider({value: 0, disabled: true});
            this.model.on('change:currentTime', this.moveSeeker, this);
            this.model.on('change:duration', this.changeLength, this);
		},
        
        moveSeeker: function() {
            this.$el.slider("value", this.model.get('currentTime'));
        },
        
        changeLength: function() {
            this.$el.slider("option", "disabled", false);
            this.$el.slider("option", "min", 0);
            this.$el.slider("option", "max", this.model.get('duration'));
        },
        
        onSlide: function(event, ui) {
            console.log("Sliding to %d", ui.value);
            this.model.set({currentTime: ui.value});
        }
	});
	
	return SeekerView;
});