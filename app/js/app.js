define(['jquery', 'views/app', 'server'], function($, AppView, Server) {
	var App = function() {
		var self = this;
		
		self.server = new Server(self);
		self.server.startupSync(function() {
			self.views.app = new AppView(self);
			self.views.app.render();
		});
	};

	App.prototype = {
			views: {},
			collections: {}
	};

	return App;
});
