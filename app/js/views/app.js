define(['backbone', 'underscore', 'text!templates/app.html', 'models/section', 'jquery.ui', 'jquery.jqtree'], function(Backbone, _, template, Section) {
	var doubleSelected = null;
	
	function secondsToTime(timeInSeconds) {
		var hours = parseInt(timeInSeconds / 3600, 10) % 24,
			minutes = parseInt(timeInSeconds / 60, 10) % 60,
			seconds = parseInt(timeInSeconds, 10) % 60;
		
		return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
	}
	
	function findAll(sections, sectionId) {
		var results = [];
		sections.forEach(function(section) {
			if (section.id === sectionId) {
				results.push(section);
			}
			
			if (section.sections) {
				results = results.concat(findAll(section.sections, sectionId));
			}
		});
		
		return results;
	}
	
	function findPathUntil(sections, sectionId) {
		var path = [];
		sections.forEach(function(child) {
			buildPath(path, child, sectionId);
		});
		
		return path;
	}
	
	function isInPathTo(querySection, sectionId) {
		if (isLeaf(querySection)) return false;
		
		var foundSections = findAll(querySection.sections, sectionId);
		return foundSections.length > 0;
	}
	
	function isLeaf(section) {
		return !section.sections || section.sections.length === 0; 
	}
	
	function buildPath(path, section, sectionId) {
		if (section.id === sectionId) {
			path.push(section.title);
		} else if (isInPathTo(section, sectionId)) {
			path.push(section.title);
			section.sections.forEach(function(child) {
				buildPath(path, child, sectionId);
			});
		}
	}
			
	function updateTree(tree, text) {
		$("#chapterList").tree("loadData", tree);
		
		$("#currentlyShowing").text(text);
	}
	
	var AppView = Backbone.View.extend({
		el: 'body',
		template: _.template(template),
		
		events: {
			
		},
		
		initialize: function(app) {
			this.app = app;
		},
		
		render: function() {
			var self = this,
				$el = $(self.el),
				sections = self.app.collections.sections,
				video;
			
			$el.html(self.template);
			
			video = $("#video1").get(0);
			
            $("#chapterList")
			.tree({
				data: [],
				autoOpen: true,
				selectable: true
			})
			.bind('tree.select', function(event) {
				var sectionId = event.node.id,
					start, end,
					path = [self.app.models.activeMedium.get("title")],
					showingSection;
				
				if (sectionId === "-1") {
					self.app.models.showingSection = new Section(self.app.models.activeMedium.get("duration"));
										
					$("#currentlyShowing").text(self.app.models.medium.title);
				} else {
					self.app.models.showingSection = sections.findById(sectionId);
					
					path = path.concat(findPathUntil(self.app.models.medium.sections, sectionId));
					$("#currentlyShowing").text(path.join(' / '));
				}
				
				if (doubleSelected) {
					$(doubleSelected.element).find('.jqtree-title').removeClass("doubleSelected");
				}
				
				showingSection = self.app.models.showingSection;
				
				start = showingSection.startAsSeconds(),
				end = showingSection.endAsSeconds();
				
				$("#seeker").slider("option", "min", start);
				$("#seeker").slider("option", "max", end);
				
				$("#seeker").slider("value", start);
				
				$("#video1").get(0).currentTime = start;

				$("#interval").slider("option", "min", start);
				$("#interval").slider("option", "max", end);	
				
				$("#intervalControls").hide();
				
				$("#chapterTitle").val("");
				$("#chapterDescription").val("");
				$("#chapterStart").text("");
				$("#chapterEnd").text("");
			})
			.bind("tree.contextmenu", function(event) {
				var sectionId = event.node.id,
					section,
					start, end;
					
				if (doubleSelected) {
					$(doubleSelected.element).find('.jqtree-title').removeClass("doubleSelected");
				}
				
				if (sectionId === "-1") {
					self.app.models.activeSection = new Section();
					self.app.models.showingSection = new Section(self.app.models.activeMedium.get("duration"));
					$("#intervalControls").hide();

					$("#chapterTitle").val(self.app.models.medium.title);
					$("#chapterDescription").val("");
					$("#chapterStart").text("00:00:00");
					$("#chapterEnd").text(self.app.models.medium.duration);
					
					$("#chapterList").tree("selectNode", event.node);
				} else {
					section = sections.findById(sectionId);
					self.app.models.activeSection = section;
					
					start = section.startAsSeconds(),
					end = section.endAsSeconds();
					$("#interval").slider("option", "values", [start, end]);
					$("#intervalControls").show();

					$("#chapterTitle").val(section.get("title"));
					$("#chapterDescription").val(section.get("description"));
					$("#chapterStart").text(section.get("start"));
					$("#chapterEnd").text(section.get("end"));
					
					doubleSelected = event.node;
					$(doubleSelected.element).find('.jqtree-title:first').addClass("doubleSelected");
				}
			});
			
			$("#interval").slider({
				range: true,
				disabled: false,
				slide: function(event, ui) {
					var start = secondsToTime(ui.values[0]),
						end = secondsToTime(ui.values[1]);
					
					$("#chapterStart").text(start);
					$("#chapterEnd").text(end);
				},
				stop: function(event, ui) {
					var start = secondsToTime(ui.values[0]),
						end = secondsToTime(ui.values[1]),
						sectionId = self.app.models.activeSection.get('id'),
						url = "/media/" + self.app.models.activeMedium.get("id") + "/chapters/" + sectionId;
					
					sections.updateById(sectionId, {"start": start, "end": end });
					
					$.post(url, {"newStart": start, "newEnd": end });
				}
			});
			
			$("#intervalControls").hide();
						
			video.addEventListener('durationchange', function() {
				$("#interval").slider("option", "min", 0);
				$("#interval").slider("option", "max", video.duration);		
				$("#interval").slider("option", "values", [0, video.duration]);
			});
						
			$("#speed").slider({
				orientation: "vertical",
				range: "min",
				min: 0,
				max: 3,
				step: 0.5,
				value: 1,
				slide: function( event, ui ) {
					video.playbackRate = ui.value;
				}
			});

			$("#play").click(function() {
				if (video.paused) {
					video.play();
				} else {
					video.pause();
				}
			});
			
			return this;
		}
	});
	
	return AppView;
});