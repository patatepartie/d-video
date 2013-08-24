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
          "library:edit_medium": this.editMedium,
          "library:delete_medium": this.deleteMedium
        }, this);

        this.region = new Region({el: "#medium .selection"});

        // Replace that by a bootstrap
        this.media = new Media();
        this.media.fetch({reset :true});
      },

      showMediaView: function (medium) {
        var selectionView = new MediumSelectionView({collection: this.media});

        this.region.show(selectionView);

        if (medium) {
          selectionView.selectMedium(medium);        
        }
      },

      selectMedium: function(medium) {
        this.selectedMedium = medium;
      },

      editMedium: function(currentMedium) {
        var mediumEditing = this.region.show(new MediumEditionView({model: currentMedium || new Medium()}));
        var self = this;

        mediumEditing.done(function(medium) {
          if (medium.hasChanged()) {
            medium.save().done(function() {
              self.showMediaView(medium)    
            });

            self.media.add(medium);
          }
        }).fail(function() {
          self.showMediaView(this.selectedMedium);
        });
      },

      deleteMedium: function (currentMedium) {
        var mediumDeleting = this.region.show(new MediumDeletionView({model: currentMedium}));
        var self = this;

        mediumDeleting.done(function(medium) {
          medium.destroy();

          self.showMediaView();
        }).fail(function() {
          self.showMediaView(this.selectedMedium);
        });
      }
    });

    return Library;
  }
);