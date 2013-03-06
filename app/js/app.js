define(['views/app'], function(AppView) {
	var App = function() {
		this.views.app = new AppView();
		this.views.app.render();
	};

	App.prototype = {
			views: {}
	};

	return App;
});
