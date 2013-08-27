define([
  'backbone', 'underscore', 'region', 
  'views/medium_selection_view', 
  'views/medium_edition_view',
  'views/medium_deletion_view',
  'collections/media',
  'models/medium'], 

  function(Backbone, _, Region, MediumSelectionView, MediumEditionView, MediumDeletionView, Media, Medium) {
    var Library = function(options) {
      this._configure(options || {});
      this.initialize.apply(this, arguments);
    };

    _.extend(Library.prototype, {
      _configure: function (options) {
        this.el = options.el;
      },

      initialize: function (options) {
        this.region = new Region({el: "#medium .selection"});
        
        this.media = new Media(options.initialMedia);

        Backbone.on( {
          "library:select_medium": this.selectMedium,
          "library:create_medium": this.createMedium,
          "library:edit_medium": this.editMedium,
          "library:delete_medium": this.deleteMedium
        }, this);
      },

      showMedia: function (medium) {
        this.region.show(new MediumSelectionView({collection: this.media}));
        this.selectMedium(medium);
      },

      selectMedium: function(medium) {
        if (medium) {
          this.media.changeSelected(medium);
        }
      },

      createMedium: function() {
        this._editMedium(new Medium());
      },

      editMedium: function(currentMedium) {
        var medium = this._mediumFromParameter(currentMedium);
        this._editMedium(medium.clone());
      },

      _editMedium: function(medium) {
        var self = this;
        var mediumEditing = this.region.show(new MediumEditionView({model: medium}));

        mediumEditing.done(function(medium) {
          self.media.add(medium, {merge: true});

          medium.save().done(function() {
            self.showMedia(medium)    
          });
        }).fail(function() {
          if (medium.isNew()) {
            self.showMedia(self.media.getSelected());
          } else {
            self.showMedia(medium);
          }
        });
      },

      deleteMedium: function (currentMedium) {
        var self = this;
        var medium = this._mediumFromParameter(currentMedium);
        var mediumDeleting = this.region.show(new MediumDeletionView({model: medium}));

        mediumDeleting.done(function(medium) {
          medium.destroy();

          self.showMedia();
        }).fail(function() {
          self.showMedia(medium);
        });
      },

      _mediumFromParameter: function(medium) {
        return medium instanceof Medium ? medium : this.media.get(medium);
      }
    });

    return Library;
  }
);