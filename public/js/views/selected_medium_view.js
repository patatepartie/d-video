define([
  'backbone', 'mustache', 
  'text!templates/selected_medium_view.html'], 

  function(Backbone, Mustache, template) {
    var MediumView = Backbone.View.extend({
      tagName: "button",
      className: "btn btn-default dropdown-toggle",

      attributes: {
        'data-toggle': 'dropdown'
      },

      template: Mustache.compile(template),

      initialize: function() {
        this.listenTo(this.collection, "change:selected", this.render);
      },

      render: function() {
        var selectedMedium = this.collection.getSelected();

        this.$el.html(this.template({medium: selectedMedium ? selectedMedium.toJSON() : selectedMedium}));

        return this;
      }
    });

    return MediumView;
  }
);