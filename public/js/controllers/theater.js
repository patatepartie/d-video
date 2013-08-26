define([
  'backbone', 'underscore', 'region',
  'views/content_selection_view', 'models/content'],

  function(Backbone, _, Region, ContentSelectionView, Content) {
    var Theater = function() {
      this.initialize.apply(this, arguments);
    };

    _.extend(Theater.prototype, {
      initialize: function() {
        Backbone.on({
          "library:select_medium": this.showContentChooser
        }, this);

        this.region = new Region({el: "#content .selection"});
      },

      showContentChooser: function(medium) {
        if (medium) {
          this.content = new Content();
          this.region.show(new ContentSelectionView({model: this.content}));
        }
      }
    });

    return Theater;
  }
);