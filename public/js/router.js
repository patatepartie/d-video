define([
  'backbone', 'controllers/library'], 

  function(Backbone, Library) {
    var Router = Backbone.Router.extend({
      routes: {
        "": "loadLayout",
        "medium/:id": "selectMedium"
      },

      initialize: function (options) {
        this.library = new Library({initialMedia: options.initialMedia});
        Backbone.on({
          "library:select_medium": this.navigateToMediumUrl
        }, this);
      },

      loadLayout: function () {
        this.library.showMediaView();
      },

      selectMedium: function(id) {
        this.library.showMediaView(id);
      },

      navigateToMediumUrl: function(medium) {
        if (medium) {
          this.navigate("medium/" + medium.get('id'));
        } else {
          this.navigate("", {trigger: true});
        }
      }
    });

    return Router;
  }
);