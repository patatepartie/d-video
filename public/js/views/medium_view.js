define([
  'backbone', 'mustache', 
  'text!templates/medium_view.html'], 

  function(Backbone, Mustache, template) {
    var MediumView = Backbone.View.extend({
      tagName: "li",
      template: Mustache.compile(template),

      events: {
        'click': 'selectMedium'
      },

      initialize: function(options) {
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "destroy", this.remove);
      },

      render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
      },

      selectMedium: function(event) {
        event.preventDefault();

        Backbone.trigger('library:select_medium', this.model);
      }
    });

    return MediumView;
  }
);