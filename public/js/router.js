define([
  'backbone', 'jquery', 
  'views/medium_selection_view', 
  'views/medium_edition_view',
  'views/medium_deletion_view',
  'collections/media',
  'models/medium'], 

  function(Backbone, $, MediumSelectionView, MediumEditionView, MediumDeletionView, Media, Medium) {
    var router = Backbone.Router.extend({
      routes: {
        "": "loadLayout"
      },

      initialize: function () {
        Backbone.on( {
          "library:select_medium": this.selectMedium,
          "library:edit_medium": this.showEditionView,
          "library:delete_medium": this.showDeletionView,
          "library:medium_edited": this.validateMediaEditing,
          "library:medium_edition_cancelled": this.cancelMediaEditing,
          "library:medium_deleted": this.validateMediaDeletion,
          "library:medium_deletion_cancelled": this.cancelMediaDeletion
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

      showEditionView: function (currentMedium) {
        var medium = currentMedium || new Medium();
        this.selectionView.remove();
        this.selectionView = new MediumEditionView({model: medium});

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

        if (medium) {
          this.selectionView.selectMedium(medium);        
        }
      },

      showDeletionView: function (currentMedium) {
        this.selectionView.remove();
        this.selectionView = new MediumDeletionView({model: currentMedium});

        this.mediumSelectionRegion.html(this.selectionView.render().el);
      },

      validateMediaDeletion: function(medium) {
        medium.destroy();

        this.showMediaView();
      },

      cancelMediaDeletion: function() {
        this.showMediaView(this.selectedMedium);
      }
    });

    return router;
  }
);