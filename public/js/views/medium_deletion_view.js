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

      initialize: function() {
        this.result = Backbone.$.Deferred();
      },

      promise: function() {
        return this.result.promise();
      },

      render: function () {
        this.$el.html(this.template(this.model.attributes));

        return this;
      },

      deletionValidated: function () {
        this.result.resolve(this.model);
      },

      deletionCancelled: function () {
        this.result.reject();
      }
    });

    return MediumDeletionView;
  }
);