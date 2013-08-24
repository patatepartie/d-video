define([
  'backbone', 'controllers/library'], 

  function(Backbone, Library) {
    var Router = Backbone.Router.extend({
      routes: {
        "": "loadLayout"
      },

      initialize: function () {
        this.library = new Library();
      },

      loadLayout: function () {
        this.library.showMediaView();
      }
    });

    return Router;
  }
);