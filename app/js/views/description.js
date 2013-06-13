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
		
		initialize: function(options) {
            this.content = options.content;
            
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
            var sectionId = event.node.id, section;
            
            this.removePreviouslyRightSelected();
            
            if (this.isRoot(sectionId)) {
                this.content.set({start: 0, end: this.content.get('duration')});
            } else {
                section = this.collection.get(sectionId);
                this.content.set({start: section.getStartInSeconds(), end: section.getEndInSeconds()});
            }
        },
        
        subSectionSelected: function(event) {
            var sectionId = event.node.id;
            
            this.removePreviouslyRightSelected();
            
            if (this.isRoot(sectionId)) {
                this.selectRoot(event.node);
			} else {
				this.rightSelectNode(event.node);
			}
        },
        
        isRoot: function(sectionId) {
            return sectionId === this.model.get('id');
        },
        
        rightSelectNode: function(node) {
            this.rightSelected = node;
            $(this.rightSelected.element).find('.jqtree-title:first').addClass("rightSelected");
        },
        
        selectRoot: function(root) {
            this.$el.tree('selectNode', root);
        },
        
        removePreviouslyRightSelected: function() {
            if (this.rightSelected) {
                $(this.rightSelected.element).find('.jqtree-title').removeClass("rightSelected");
            }
        }
	});
	
	return DescriptionView;
});