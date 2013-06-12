define([
    'backbone', 
    'underscore', 
    'text!templates/descriptions.html'],
    
    function(Backbone, _, templateFile) {
        var DescriptionsListView = window.Backbone.View.extend({
            template: _.template(templateFile),
            
            events: {
                'change select': 'selectedDescriptionChanged'   
            },
            
            initialize: function () {
                this.listenTo(this.collection, 'reset', this.render);
            },
            
            render: function() {
                this.$el.html(this.template({descriptions: this.collection.toJSON()}));

                return this;    
            },
            
            selectedDescriptionChanged: function() {
                var selectedDescriptionId = this.$el.find('select').val(),
                    selectedDescription = this.collection.get(selectedDescriptionId);
                
                Backbone.trigger('description:selected', selectedDescription);
            }
        });
        
        return DescriptionsListView;
});