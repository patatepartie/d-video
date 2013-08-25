define(['backbone', 'router'], function(Backbone, Router) {
  var Application = function() {
    return {
      start: function(boostrap) {
        var initialMedia = boostrap ? boostrap.media : [];
        this.router = new Router({initialMedia: initialMedia});
        
        Backbone.history.start({pushState: true});
      }
    }
  };

  return Application;
});