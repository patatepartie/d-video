define([
  'backbone', 'jquery', 
  'views/medium_selection_view', 
  'views/medium_edit_view',
  'collections/media',
  'models/medium'], 

  function(Backbone, $, MediumSelectionView, MediumEditView, Media, Medium) {
    var router = Backbone.Router.extend({
      routes: {
        "": "loadLayout"
      },

      initialize: function () {
        Backbone.on( {
          "library:edit_medium": this.showEditView,
          "library:select_medium": this.selectMedium,
          "library:medium_edited": this.validateMediaEditing,
          "library:medium_edition_cancelled": this.cancelMediaEditing
        }, this);

        // Replace that by a bootstrap
        this.media = new Media();
        this.media.fetch({reset :true});

        this.mediumSelectionRegion = $("#medium .selection")
      },

      loadLayout: function () {
        this.selectionView = new MediumSelectionView({collection: this.media});
        
        this.mediumSelectionRegion.html(this.selectionView.render().el);
      },

      selectMedium: function(medium) {
        this.selectedMedium = medium;
      },

      showEditView: function (currentMedium) {
        var medium = currentMedium || new Medium();
        this.selectionView.remove();
        this.selectionView = new MediumEditView({model: medium});

        this.mediumSelectionRegion.html(this.selectionView.render().el);
      },

      validateMediaEditing: function(medium) {
        var self = this;

        if (medium.isNew()) {
          this.media.add(medium);
        }

        if (medium.hasChanged()) {
          medium.save().done(function() {
            self.showMediaView(medium)    
          });
        }        
      },

      cancelMediaEditing: function() {
        this.showMediaView(this.selectedMedium);
      },

      showMediaView: function (medium) {
        this.selectionView.remove();
        this.selectionView = new MediumSelectionView({collection: this.media});

        this.mediumSelectionRegion.html(this.selectionView.render().el);
        this.selectionView.selectMedium(medium);        
      }
    });

    return router;
  }
);