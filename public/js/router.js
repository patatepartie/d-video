define([
  'backbone', 'controllers/library'], 

  function(Backbone, Library) {
    var Router = Backbone.Router.extend({
      routes: {
        "": "loadLayout"
      },

      initialize: function (options) {
        this.library = new Library({initialMedia: options.initialMedia});
      },

      loadLayout: function () {
        this.library.showMediaView();
      }
    });

    return Router;
  }
);