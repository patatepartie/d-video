define([
    'backbone', 
    'underscore', 
    'text!templates/descriptions.html'],
    
    function(Backbone, _, itemTemplateFile) {
        var DescriptionsListView = window.Backbone.View.extend({
            template: _.template(itemTemplateFile),
            
            events: {
                'change select': 'selectedDescriptionChanged'   
            },
            
            initialize: function () {
                this.listenTo(this.collection, "reset", this.render);
            },
            
            render: function() {
                this.$el.html(this.template({descriptions: this.collection.toJSON()}));

                return this;    
            },
            
            selectedDescriptionChanged: function() {
                var selectedMediumId = this.$el.find('select').val(),
                selectedMedium = this.collection.findById(selectedMediumId);
                Backbone.trigger('medium:selected', selectedMedium);
            }
        });
        
        return DescriptionsListView;
});