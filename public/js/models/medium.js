define(['backbone'], function(Backbone) {
  var Medium = Backbone.Model.extend({
    defaults: {
      title: '',
      selected: false
    },
    validate: function(attrs, options) {
      if (!attrs.title.trim()) {
        return 'Cannot have a blank title';
      }
    }
  });
  
  return Medium;
});