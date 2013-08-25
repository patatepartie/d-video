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
          "library:create_medium": this.navigateToNewMediumUrl,
          "library:edit_medium": this.navigateToEditMediumUrl,
          "library:delete_medium": this.navigateToDeleteMediumUrl
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

      navigateToNewMediumUrl: function() {
        this.navigate("medium/new");
      },

      navigateToMediumUrl: function(medium) {
        if (medium) {
          this.navigate("medium/" + medium.get('id'));
        } else {
          this.navigate("", {trigger: true});
        }
      },

      navigateToEditMediumUrl: function(medium) {
        if (medium) {
          this.navigate("medium/" + medium.get('id') + "/edit");
        } else {
          this.navigate("", {trigger: true});
        }
      },

      navigateToDeleteMediumUrl: function(medium) {
        if (medium) {
          this.navigate("medium/" + medium.get('id') + "/delete");
        } else {
          this.navigate("", {trigger: true});
        }
      }
    });

    return Router;
  }
);