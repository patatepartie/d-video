define(['backbone.localstorage', 'models/section'], function(Section) {
	function appendSubSections(allSections, nodes) {
		if (nodes !== undefined) {
			nodes.forEach(function(section) {
				var results = allSections.filter(function(subSection) {
					return subSection.get("parent") === section.get("id");
				});
				if (results.length > 0) {
					section.set("sections", results);
					appendSubSections(allSections, results);
				}
			});
		}
	}
	
	var Sections = Backbone.Collection.extend({
		model: Section,
		localStorage: new Backbone.LocalStorage("sections"),
		
		asTree: function(mediumId) {
			var results = this.filter(function(section) {
				return section.get("parent") === mediumId;
			});
			
			appendSubSections(this, results);
			
			return results;
		},
		
		findById: function(sectionId) {
			return this.find(function(section) {
				return section.get("id") === sectionId;
			});
		},
		
		updateById: function(sectionId, newValues) {
			var section = this.findById(sectionId);
			section.save(newValues);
		}
	});
	
	return Sections;
});