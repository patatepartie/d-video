define([
    'backbone', 
    'underscore', 
    'text!templates/descriptions.html'],
    
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
            // tagName:'select',
            template: _.template(itemTemplateFile),
            
            initialize: function () {
                this.listenTo(this.collection, "reset", this.render);
            },
            
            render: function() {
                // var self = this;
                this.$el.html(this.template({descriptions: this.collection.toJSON()}));
                // _.each(this.collection.models, function (description) {
                //     self.$el.append(new DescriptionsListItemView({model: description}).render().el);
                // });
                
                return this;    
            }        
        });
        
        return DescriptionsListView;
});