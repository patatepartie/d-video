define(['jquery', 'views/app', 'server', 'models/medium'], function($, AppView, Server, Medium) {
	var App = function() {
		var self = this;
		
		self.selectedMedium = new Medium();

		self.server = new Server(self);
		self.server.startupSync(function() {
			self.views.app = new AppView(self);
			self.views.app.render();
		});
	};

	App.prototype = {
			views: {},
			collections: {},
			selectedMedium: {}
	};

	return App;
});
