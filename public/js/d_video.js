define(['backbone', 'router'], function(Backbone, Router) {
  var Application = function() {
    return {
      start: function() {
        this.router = new Router();
        
        Backbone.history.start({pushState: true});
      }
    }
  };

  return Application;
});