define(['backbone', 'underscore', 'jquery.jqtree'], function(Backbone, _) {
	function convertMediumtoTree(description, sections) {
		var root = {
			id: description.get('id'),
			label: description.get('title'),
            children: []
		}, 
        nodesStack = [root];
	
        sections.each(function(section) {
            var newNode = {id: section.get('id'), label: section.get('title'), children: []},
                currentNode = nodesStack.pop();
                
            while (section.get('parentId') !== currentNode.id) {
                currentNode = nodesStack.pop();
            }
            
            currentNode.children.push(newNode);
            nodesStack.push(currentNode);
            nodesStack.push(newNode);
		});
	
		return [root];
	}
	
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
            this.$el.tree("loadData", convertMediumtoTree(this.model, this.collection));
			
			return this;
		}		
	});
	
	return DescriptionView;
});