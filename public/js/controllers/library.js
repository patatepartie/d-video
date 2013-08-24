define([
  'backbone', 'region', 
  'views/medium_selection_view', 
  'views/medium_edition_view',
  'views/medium_deletion_view',
  'collections/media',
  'models/medium'], 

  function(Backbone, Region, MediumSelectionView, MediumEditionView, MediumDeletionView, Media, Medium) {
    var Library = function(options) {
      this._configure(options || {});
      this.initialize.apply(this, arguments);
    };

    _.extend(Library.prototype, {
      _configure: function (options) {
        this.el = options.el;
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

        this.region = new Region({el: "#medium .selection"});

        // Replace that by a bootstrap
        this.media = new Media();
        this.media.fetch({reset :true});
      },

      selectMedium: function(medium) {
        this.selectedMedium = medium;
      },

      showEditionView: function(currentMedium) {
        var medium = currentMedium || new Medium();

        this.region.show(new MediumEditionView({model: medium}));
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
        var selectionView = new MediumSelectionView({collection: this.media});

        this.region.show(selectionView);

        if (medium) {
          selectionView.selectMedium(medium);        
        }
      },

      showDeletionView: function (currentMedium) {
        this.region.show(new MediumDeletionView({model: currentMedium}));
      },

      validateMediaDeletion: function(medium) {
        medium.destroy();

        this.showMediaView();
      },

      cancelMediaDeletion: function() {
        this.showMediaView(this.selectedMedium);
      }
    });

    return Library;
  }
);