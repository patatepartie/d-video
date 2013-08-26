define([
  'backbone', 'mustache', 
  'text!templates/content_selection_view.html'], 

  function(Backbone, Mustache, template) {
    var MediumSelectionView = Backbone.View.extend({
      template: Mustache.compile(template),

      events: {
        "click .content_chooser": "linkClicked",
        "change .content_file": "fileChanged"
      },

      render: function (event) {
        this.$el.html(this.template());

        return this;
      },

      linkClicked: function(event) {
        event.preventDefault();

        this.$el.find(".content_file").click();
      },

      fileChanged: function(event) {
        var contentFile = event.target.files[0],
            fileUrl = window.URL.createObjectURL(contentFile);
                
        this.model.set({url: fileUrl});
      }
    });

    return MediumSelectionView;
  }
);