define([
    'backbone', 
    'underscore', 
    'text!templates/description.html'],
    
    function(Backbone, _, itemTemplateFile) {
        var DescriptionsListItemView = window.Backbone.View.extend({
            tagName:'option',
            
            template: _.template(itemTemplateFile),
            
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                
                return this;    
            }        
        });
        
        var DescriptionsListView = window.Backbone.View.extend({
            tagName:'select',
            
            render: function() {
                var self = this;
                
                _.each(this.collection.models, function (description) {
                    self.$el.append(new DescriptionsListItemView({model: description}).render().el);
                });
                
                return this;    
            }        
        });
        
        return DescriptionsListView;
});