define([
  'backbone', 'jquery'], 

  function(Backbone, $) {
    var Region = function(options) {
      this._configure(options || {});
      this.initialize.apply(this, arguments);
    };


    _.extend(Region.prototype, {
      initialize: function() {},

      _configure: function (options) {
        if (options.el) {
          this.el = options.el;
          this.$el = $(options.el);
        }
      },

      show: function (view) {
        if (this.currentView) {
          this.currentView.remove();
        }

        this.currentView = view;
        this.$el.html(this.currentView.render().el);

        if (this.currentView.promise) {
          return this.currentView.promise();
        }
      }
    });

    return Region;
  }
);