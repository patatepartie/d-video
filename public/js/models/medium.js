define(['backbone'], function(Backbone) {
  var Medium = Backbone.Model.extend({
    defaults: {
      title: ''
    }
  });
  
  return Medium;
});