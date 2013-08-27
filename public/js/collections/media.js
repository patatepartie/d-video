define(['backbone', 'models/medium'], function(Backbone, Medium) {
  var Media = Backbone.Collection.extend({
    model: Medium,
    url: '/api/media',
    sort: "title",

    getSelected: function() {
      return this.findWhere({selected: true});
    },

    changeSelected: function(newlySelected) {
      newlySelected = newlySelected instanceof Medium ? newlySelected : this.get(newlySelected);
      
      if (!newlySelected.get('selected')) {
        this.where({selected: true}).forEach(function(medium) {
          return medium.save({selected: false});
        });

        newlySelected.save({selected: true});
      }
    }
  });

  return Media;
});