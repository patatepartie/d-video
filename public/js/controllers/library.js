define([
  'backbone', 'region', 
  'views/medium_selection_view', 
  'views/medium_edition_view',
  'views/medium_deletion_view',
  'collections/media',
  'models/medium'], 

  function(Backbone, Region, MediumSelectionView, MediumEditionView, MediumDeletionView, Media, Medium) {
    var Library = function() {
      Backbone.on( {
          "library:select_medium": this.selectMedium,
          "library:edit_medium": this.showEditionView,
          "library:delete_medium": this.showDeletionView,
          "library:medium_edited": this.validateMediaEditing,
          "library:medium_edition_cancelled": this.cancelMediaEditing,
          "library:medium_deleted": this.validateMediaDeletion,
          "library:medium_deletion_cancelled": this.cancelMediaDeletion
        }, this);

      this.region = new Region({el: "#medium .selection"});

      // Replace that by a bootstrap
      this.media = new Media();
      this.media.fetch({reset :true});
    };

    Library.prototype.selectMedium = function(medium) {
      this.selectedMedium = medium;
    };

    Library.prototype.showEditionView = function (currentMedium) {
      var medium = currentMedium || new Medium();

      this.region.show(new MediumEditionView({model: medium}));
    },

    Library.prototype.validateMediaEditing = function(medium) {
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

    Library.prototype.cancelMediaEditing = function() {
      this.showMediaView(this.selectedMedium);
    },

    Library.prototype.showMediaView = function (medium) {
      var selectionView = new MediumSelectionView({collection: this.media});

      this.region.show(selectionView);

      if (medium) {
        this.selectionView.selectMedium(medium);        
      }
    },

    Library.prototype.showDeletionView = function (currentMedium) {
      this.region.show(new MediumDeletionView({model: currentMedium}));
    },

    Library.prototype.validateMediaDeletion = function(medium) {
      medium.destroy();

      this.showMediaView();
    },

    Library.prototype.cancelMediaDeletion = function() {
      this.showMediaView(this.selectedMedium);
    }

    return Library;
  }
);