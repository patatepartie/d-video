define(['backbone', 'models/medium'], function(Backbone, Medium) {
  var Media = Backbone.Collection.extend({
    model: Medium,
    url: '/api/media',
    sort: "title"
  });

  return Media;
});