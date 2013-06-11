define(['backbone', 'underscore', 'jquery.jqtree'], function(Backbone, _) {
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
	
	var DescriptionView = Backbone.View.extend({
		events: {
		},
		
		initialize: function() {
            this.listenTo(this.collection, 'reset', this.render);
            
            this.$el.tree({
				data: [],
				autoOpen: true,
				selectable: true
			});
		},
		
		render: function() {
			var self = this,
				$el = $(self.el);
			
			console.log(this.collection);
			
			return this;
		}		
	});
	
	return DescriptionView;
});