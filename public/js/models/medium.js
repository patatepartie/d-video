define(['backbone'], function(Backbone) {
  var Medium = Backbone.Model.extend({
    defaults: {
      title: ''
    },
    validation: {
      title: {
        required: true
      }
    }
  });
  
  return Medium;
});