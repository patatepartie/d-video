define([
  'backbone', 'mustache', 
  'text!templates/medium_selection_view.html'], 

  function(Backbone, Mustache, template) {
    var MediumSelectionView = Backbone.View.extend({
      template: Mustache.compile(template),

      events: {
        "change select": "_mediumSelected",
        "click .controls [name=add]": "_mediumCreationRequested",
        "click .controls [name=edit]": "_mediumEditionRequested",
        "click .controls [name=delete]": "_mediumDeletionRequested"
      },

      initialize: function () {
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'add', this.render);
        this.listenTo(this.collection, 'remove', this.render);
        this.listenTo(this.collection, 'change', this.render);
      },

      render: function (event) {
        this.$el.html(this.template({media: this.collection.toJSON()}));

        return this;
      },

      selectMedium: function(medium) {
        this.$el.find('select').val(medium.get('id')).change();
      },

      _mediumSelected: function(event) {
        event.preventDefault();

        this._getSelectedMedium().done(function (selectedMedium) {
          Backbone.trigger('library:select_medium', selectedMedium);
        }).fail(function() {
          Backbone.trigger('library:select_medium');
        });
      },

      _mediumCreationRequested: function (event) {
        event.preventDefault();

        Backbone.trigger('library:edit_medium');
      },

      _mediumEditionRequested: function (event) {
        event.preventDefault();

        this._getSelectedMedium().done(function (selectedMedium) {
          Backbone.trigger('library:edit_medium', selectedMedium);
        });
      },

      _mediumDeletionRequested: function (event) {
        event.preventDefault();

        this._getSelectedMedium().done(function (selectedMedium) {
          Backbone.trigger('library:delete_medium', selectedMedium);
        });
      },

      _findSelect: function() {
        return this.$el.find('select');
      },

      // Use a Promise as a Null Object. Is it overkill ?
      _getSelectedMedium: function() {
        var selectingMedium = $.Deferred();

        var selectedId = this._findSelect().val();

        if (selectedId === "-1") {
          selectingMedium.reject();
        } else {
          selectingMedium.resolve(this.collection.get(selectedId));
        }

        return selectingMedium.promise();
      }
    });

    return MediumSelectionView;
  }
);