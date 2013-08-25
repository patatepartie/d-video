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

      initialize: function() {
        this.result = Backbone.$.Deferred();
      },

      promise: function() {
        return this.result.promise();
      },

      render: function () {
        this.$el.html(this.template(this.model.attributes));
        this.$('.invalid').hide();
        return this;
      },

      editValidated: function () {
        var newTitle = this.$('[name=title]').val();
        this.model.set('title', newTitle)
        if (this.model.isValid()) {
          this.result.resolve(this.model);
        } else {
          this.$('.invalid').show();
        }
      },

      editCancelled: function () {
        this.result.reject();
      }
    });

    return MediumEditionView;
  }
);