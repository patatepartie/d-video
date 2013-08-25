define([
  'backbone', 'controllers/library'], 

  function(Backbone, Library) {
    var Router = Backbone.Router.extend({
      routes: {
        "": "loadLayout",
        "medium/new": "createMedium",
        "medium/:id": "selectMedium"
      },

      initialize: function (options) {
        this.library = new Library({initialMedia: options.initialMedia});
        Backbone.on({
          "library:select_medium": this.navigateToMediumUrl,
          "library:create_medium": this.navigateToNewMediumUrl
        }, this);
      },

      loadLayout: function () {
        this.library.showMediaView();
      },

      createMedium: function() {
        this.library.createMedium();
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
      },

      navigateToNewMediumUrl: function() {
        this.navigate("medium/new");
      }
    });

    return Router;
  }
);