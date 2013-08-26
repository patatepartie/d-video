define([
  'backbone', 'underscore', 'router', 
  'controllers/library', 'controllers/theater'], 

  function(Backbone, _, Router, Library, Theater) {
    var Application = function() {
    };

    _.extend(Application.prototype, {
      start: function(boostrap) {
        var initialMedia = boostrap ? boostrap.media : [];
        this.library = new Library({initialMedia: initialMedia});
        this.theater = new Theater();

        this.router = new Router({library: this.library, theater: this.theater});
        
        Backbone.history.start({pushState: true});
      }
    });

    return Application;
  }
);