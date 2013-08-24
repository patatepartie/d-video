define(['backbone', 'router'], function(Backbone, Router) {
  var Application = function() {
    return {
      start: function() {
        this.router = new Router();
        
        _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
        
        Backbone.history.start({pushState: true});
      }
    }
  };

  return Application;
});