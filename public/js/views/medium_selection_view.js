define([
  'backbone', 'mustache', 
  'text!templates/medium_selection_view.html'], 

  function(Backbone, Mustache, template) {
    var MediumSelectionView = Backbone.View.extend({
      template: Mustache.compile(template),

      events: {
        "change select": "mediumSelected",
        "click .controls [name=add]": "mediumCreationRequested",
        "click .controls [name=edit]": "mediumEditionRequested"
      },

      initialize: function () {
        this.listenTo(this.collection, 'all', this.render);
      },

      render: function () {
        this.$el.html(this.template({media: this.collection.toJSON()}));

        return this;
      },

      selectMedium: function(medium) {
        this.selectOption(medium.get('id'));
      },

      selectOption: function(id) {
        this.$el.find('select').val(id).change();
      },

      mediumSelected: function(event) {
        var selectedId = this.$el.find('select').val();
        Backbone.trigger('library:select_medium', this.collection.get(selectedId));
      },

      mediumCreationRequested: function (event) {
        event.preventDefault();

        Backbone.trigger('library:edit_medium');
      },

      mediumEditionRequested: function (event) {
        event.preventDefault();

        var selectedId = this.$el.find('select').val();
        Backbone.trigger('library:edit_medium', this.collection.get(selectedId));
      }
    });

    return MediumSelectionView;
  }
);