define(['backbone', 'underscore', 'text!templates/contentLoader.html'], function(Backbone, _, templateFile) {
	var ContentLoadingView = window.Backbone.View.extend({
        template: _.template(templateFile),
        
		events: {
			'click .mediaFile': 'linkClicked',
            'change .mediaFileChooser': 'chooserClicked',
		},
		
        render: function() {
            this.$el.html(this.template());
            
            return this;    
        },
        
		linkClicked: function(event) {
            event.preventDefault();
            $('.mediaFileChooser').click();            
        },
        
        chooserClicked: function(event) {
            var mediumFile = event.target.files[0],
                mediumUrl = window.URL.createObjectURL(mediumFile);
                
            this.model.set({url: mediumUrl});
        }
	});
	
	return ContentLoadingView;
});