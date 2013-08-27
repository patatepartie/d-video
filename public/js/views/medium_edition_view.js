define([
  'backbone', 'mustache', 
  'text!templates/medium_edition_view.html'], 

  function(Backbone, Mustache, template) {
    var MediumEditionView = Backbone.View.extend({
      template: Mustache.compile(template),

      events: {
        "click .btn-group [name=ok]": "editValidated",
        "click .btn-group [name=cancel]": "editCancelled"
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

      editValidated: function (event) {
        event.preventDefault(); 

        var newTitle = this.$('#title').val();
        this.model.set('title', newTitle)
        if (this.model.isValid()) {
          this.result.resolve(this.model);
        } else {
          this.$('.invalid').show();
        }
      },

      editCancelled: function () {
        event.preventDefault();
        
        this.result.reject();
      }
    });

    return MediumEditionView;
  }
);