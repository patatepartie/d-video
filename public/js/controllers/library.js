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

      initialize: function (options) {
        Backbone.on( {
          "library:select_medium": this.selectMedium,
          "library:edit_medium": this.editMedium,
          "library:delete_medium": this.deleteMedium
        }, this);

        this.region = new Region({el: "#medium .selection"});

        this.media = new Media(options.initialMedia);
      },

      showMediaView: function (medium) {
        var selectionView = new MediumSelectionView({collection: this.media});

        this.region.show(selectionView);

        if (medium) {
          if (medium.prototype === Medium) {
            selectionView.selectMedium(medium);        
          } else {
            selectionView.selectMedium(new Medium({id: medium}));
          }
        }
      },

      selectMedium: function(medium) {
        this.selectedMedium = medium;
      },

      editMedium: function(currentMedium) {
        var selectedOrNewMedium = currentMedium ? currentMedium.clone() : new Medium();
        var mediumEditing = this.region.show(new MediumEditionView({model: selectedOrNewMedium}));
        var self = this;

        mediumEditing.done(function(medium) {
          if (medium.hasChanged()) {
            self.media.add(medium, {merge: true});

            medium.save().done(function() {
              self.showMediaView(medium)    
            });
          }
        }).fail(function() {
          self.showMediaView(self.selectedMedium);
        });
      },

      deleteMedium: function (currentMedium) {
        var mediumDeleting = this.region.show(new MediumDeletionView({model: currentMedium}));
        var self = this;

        mediumDeleting.done(function(medium) {
          medium.destroy();

          self.showMediaView();
        }).fail(function() {
          self.showMediaView(self.selectedMedium);
        });
      }
    });

    return Library;
  }
);