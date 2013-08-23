define([
  'backbone', 'mustache', 
  'text!templates/medium_view.html'], 

  function(Backbone, Mustache, template) {
    var MediumView = Backbone.View.extend({
      template: Mustache.compile(template),

      initalize: function () {
        this.listenTo(this.model, "change", this.render);
      },

      render: function () {
        this.$el.html(this.template(this.model.attributes));
        
        return this;
      },
    });

    return MediumView;
  }
);