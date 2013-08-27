define([
  'backbone', 'mustache', 
  'text!templates/medium_selection_view.html',
  'views/medium_view',
  'views/selected_medium_view',
  'models/medium'], 

  function(Backbone, Mustache, template, MediumView, SelectedMediumView, Medium) {
    var MediumSelectionView = Backbone.View.extend({
      tagName: "form",
      className: "form-inline",
      template: Mustache.compile(template),

      events: {
        "click .controls [name=add]": "_mediumCreationRequested",
        "click .controls [name=edit]": "_mediumEditionRequested",
        "click .controls [name=delete]": "_mediumDeletionRequested"
      },

      initialize: function () {
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'add', this.addMedium);

        Backbone.trigger('library:select_medium', this.collection.getSelected());
      },

      addMedium: function(medium) {
        this.$("ul").append(new MediumView({model: medium}).render().el);
      },

      render: function (event) {
        this.$el.html(new SelectedMediumView({collection: this.collection}).render().el);
        this.$el.append(this.template());

        this.collection.each(function(medium) {
          this.addMedium(medium);
        }, this);

        return this;
      },

      _mediumCreationRequested: function (event) {
        event.preventDefault();

        Backbone.trigger('library:create_medium');
      },

      _mediumEditionRequested: function (event) {
        event.preventDefault();

        var selectedMedium = this.collection.getSelected();
        if (selectedMedium) {
          Backbone.trigger('library:edit_medium', selectedMedium);
        }
      },

      _mediumDeletionRequested: function (event) {
        event.preventDefault();

        var selectedMedium = this.collection.getSelected();
        if (selectedMedium) {
          Backbone.trigger('library:delete_medium', selectedMedium);
        }
      }
    });

    return MediumSelectionView;
  }
);