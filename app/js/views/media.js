define(['backbone', 'underscore', 'text!templates/medium.html', 'models/section'], function(Backbone, _, template, Section) {
	// function convertMediumtoTree(medium) {
	// 	var tree = [{
	// 		label: 'Media',
	// 		id: "-1"
	// 	}];
	
	// 	tree[0].children = medium.sections.map(function(section) {
	// 		return convertSubSectionToNode(section);
	// 	});
	
	// 	return tree;
	// }
	
	// function convertSubSectionToNode(section) {
	// 	var node = {
	// 			label: section.get("title"),
	// 			id: section.get("id")
	// 		};
	// 		if (section.get("sections")) {
	// 			node.children = section.get("sections").map(function(section) {
	// 				return convertSubSectionToNode(section);
	// 			});
	// 		}
	
	// 	return node;
	// }
	
	// function updateTree(tree, text) {
	// 	$("#chapterList").tree("loadData", tree);
		
	// 	$("#currentlyShowing").text(text);
	// }
	
	var MediaView = Backbone.View.extend({
		el: '#mediaList',
		tagName: 'select',
		template: _.template(template),
		
		events: {
			'change': 'selectMedium'
		},
		
		initialize: function() {
			this.collection.bind('reset', this.render, this);
		},
		
		render: function() {
			var self = this,
				$el = $(self.el);
			
			this.collection.forEach(function(medium) {
				$el.append(self.template(medium.toJSON()));
			});
			
			return this;
		},
		
        selectMedium: function() {
            var selectedMediumId = this.$el.find('option:selected').val(),
                selectedMedium = this.collection.findById(selectedMediumId);
            Backbone.trigger('medium:selected', selectedMedium);
        }
		// selectMedium: function() {
		// 	var self = this,
		// 		$el = $(self.el);
			
		// 	var activeMedium = self.collection.findById($el.val());
		// 	self.models.activeMedium = activeMedium;
			
		// 	self.models.activeSection = null;
			
		// 	if (activeMedium.get("id") === "-1") {
		// 		self.models.showingSection = null;
		// 		updateTree([], "");
		// 	} else {
		// 		self.models.medium = {
		// 				id: activeMedium.get("id"),
		// 				title: activeMedium.get("title"),
		// 				duration: activeMedium.get("duration"),
		// 				sections: self.sections.asTree(activeMedium.get("id"))
		// 		};
				
		// 		self.models.showingSection = new Section({end: activeMedium.get("duration")});

		// 		updateTree(convertMediumtoTree(self.models.medium), self.models.medium.title);
		// 		var node = $("#chapterList").tree('getNodeById', "-1");
		// 		$("#chapterList").tree("selectNode", node);
		// 	}
		// }
	});
	
	return MediaView;
});