define(['backbone', 'jquery.ui'], function(Backbone) {
	var SeekerView = Backbone.View.extend({
        events: {
            'slide': 'onSlide'
        },
				
		initialize: function(options) {
            this.$el.slider({value: 0, disabled: true});
            this.listenTo(this.model, 'change:currentTime', this.moveSeeker);
            this.listenTo(this.model, 'change:duration', this.changeLength);
            this.listenTo(this.model, 'change:start', this.changeStart);
            this.listenTo(this.model, 'change:end', this.changeEnd);
		},
        
        moveSeeker: function() {
            this.$el.slider("value", this.model.get('currentTime'));
        },
        
        changeLength: function() {
            this.$el.slider("option", "disabled", false);
        },
        
        changeStart: function() {
            this.$el.slider("option", "min", this.model.get('start'));
            this.model.set({seekedTime: this.model.get('start')});
        },
        
        changeEnd: function() {
            this.$el.slider("option", "max", this.model.get('end'));
            this.model.set({seekedTime: this.model.get('start')});
        },
        
        onSlide: function(event, ui) {
            this.model.set({seekedTime: ui.value});
        }
	});
	
	return SeekerView;
});