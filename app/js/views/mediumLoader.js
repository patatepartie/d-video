define([], function() {
	var MediumLoadingView = window.Backbone.View.extend({
		el: '#videoLoader',
				
		events: {
			'click .videoFile': 'linkClicked',
            'change .videoChooser': 'chooserClicked',
		},
		
		initialize: function(options) {
		},
        
        linkClicked: function(event) {
            event.preventDefault();
            $('.videoChooser').click();            
        },
        
        chooserClicked: function(event) {
            var mediumFile = event.target.files[0],
                mediumUrl = window.URL.createObjectURL(mediumFile);
                
            this.model.set({url: mediumUrl});
            // $("#mediaList").show();
        }
	});
	
	return MediumLoadingView;
});