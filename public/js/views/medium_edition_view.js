define([
  'backbone', 'mustache', 
  'text!templates/medium_edition_view.html'], 

  function(Backbone, Mustache, template) {
    var MediumEditionView = Backbone.View.extend({
      template: Mustache.compile(template),

      events: {
        "click .controls [name=ok]": "editValidated",
        "click .controls [name=cancel]": "editCancelled"
      },

      render: function () {
        this.$el.html(this.template(this.model.attributes));

        return this;
      },

      editValidated: function () {
        var newTitle = this.$el.find('[name=title]').val();
        this.model.set({title: newTitle});

        Backbone.trigger('library:medium_edited', this.model);
      },

      editCancelled: function () {
        Backbone.trigger('library:medium_edition_cancelled');
      }
    });

    return MediumEditionView;
  }
);