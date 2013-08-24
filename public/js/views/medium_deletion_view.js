define([
  'backbone', 'mustache', 
  'text!templates/medium_deletion_view.html'], 

  function(Backbone, Mustache, template) {
    var MediumDeletionView = Backbone.View.extend({
      template: Mustache.compile(template),

      events: {
        "click .controls [name=ok]": "deletionValidated",
        "click .controls [name=cancel]": "deletionCancelled"
      },

      render: function () {
        this.$el.html(this.template(this.model.attributes));

        return this;
      },

      deletionValidated: function () {
        Backbone.trigger('library:medium_deleted', this.model);
      },

      deletionCancelled: function () {
        Backbone.trigger('library:medium_deletion_cancelled');
      }
    });

    return MediumDeletionView;
  }
);