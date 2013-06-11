define(['backbone', 'jquery.ui'], function(Backbone) {
	var SeekerView = Backbone.View.extend({
        events: {
            'slide': 'onSlide'
        },
				
		initialize: function(options) {
            this.$el.slider({value: 0, disabled: true});
            this.listenTo(this.model, 'change:currentTime', this.moveSeeker);
            this.listenTo(this.model, 'change:duration', this.changeLength);
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
            this.model.set({seekedTime: ui.value});
        }
	});
	
	return SeekerView;
});