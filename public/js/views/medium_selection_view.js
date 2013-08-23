define([
  'backbone', 'mustache', 
  'text!templates/medium_selection_view.html'], 

  function(Backbone, Mustache, template) {
    var MediumSelectionView = Backbone.View.extend({
      template: Mustache.compile(template),

      initialize: function () {
        this.listenTo(this.collection, 'all', this.render);
      },

      render: function () {
        this.$el.html(this.template({media: this.collection.toJSON()}));

        return this;
      },
    });

    return MediumSelectionView;
  }
);