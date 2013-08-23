define(['backbone', 'models/medium'], function(Backbone, Medium) {
  var media = Backbone.Collection.extend({
    model: Medium,
    url: '/api/media',
    sort: "title"
  });

  return media;
});