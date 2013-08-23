define([
  'backbone', 'jquery', 
  'views/medium_selection_view', 'collections/media'], 

  function(Backbone, $, MediumSelectionView, Media) {
    var router = Backbone.Router.extend({
      routes: {
        "": "loadLayout"
      },

      loadLayout: function () {
        this.media = new Media();
        this.selectionView = new MediumSelectionView({collection: this.media});
        this.media.fetch({reset :true});
        $("#medium .selection").html(this.selectionView.render().el);
      }    
    });

    return router;
  }
);