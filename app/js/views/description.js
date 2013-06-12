define(['backbone', 'underscore', 'jquery.jqtree'], function(Backbone, _) {
	function growTreeFrom(description, sections) {
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
            'tree.select': 'sectionSelected',
            'tree.contextmenu': 'subSectionSelected',
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
            this.$el.tree("loadData", growTreeFrom(this.model, this.collection));
			
			return this;
		},
        
        sectionSelected: function(event) {
            if (this.rightSelected) {
                $(this.rightSelected.element).find('.jqtree-title').removeClass("rightSelected");
            }
            
            console.log("Selected section %s", event.node.id);
        },
        
        subSectionSelected: function(event) {
            var sectionId = event.node.id;
            
            if (this.rightSelected) {
                $(this.rightSelected.element).find('.jqtree-title').removeClass("rightSelected");
			}
            
            if (sectionId === this.model.get('id')) {
				this.$el.tree("selectNode", event.node);
			} else {
				this.rightSelected = event.node;
				$(this.rightSelected.element).find('.jqtree-title:first').addClass("rightSelected");
			}
            console.log("Selected sub section %s", event.node.id);
        },
	});
	
	return DescriptionView;
});