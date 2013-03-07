define(['text!templates/app.html', 'jquery.ui', 'jquery.jqtree'], function(template) {
	var selectedSectionId = "-1",
		doubleSelected = null,
		medium = {};
	
	function convertMediumtoTree(medium) {
		var tree = [{
			label: 'Media',
			id: "-1"
		}];
	
		tree[0].children = medium.sections.map(function(section) {
			return convertSubSectionToNode(section);
		});
	
		return tree;
	}
	
	function convertSubSectionToNode(section) {
		var node = {
				label: section.get("title"),
				id: section.get("id")
			};
			if (section.get("sections")) {
				node.children = section.get("sections").map(function(section) {
					return convertSubSectionToNode(section);
				});
			}
	
		return node;
	}
	
	function timeToSeconds(time) {
		var components = time.split(":").map(function(item) {
			return parseInt(item);
		});
		return ((components[0] * 60) + components[1]) * 60 + components[2]; 
	}
	
	function secondsToTime(timeInSeconds) {
		var hours = parseInt( timeInSeconds / 3600 ) % 24,
			minutes = parseInt( timeInSeconds / 60 ) % 60,
			seconds = parseInt(timeInSeconds) % 60;
		
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
	
	function findPathUntil(medium, sectionId) {
		var path = [];
		medium.sections.forEach(function(child) {
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
				media = self.app.collections.media,
				video;
			
			$el.html(self.template);
			
			$("#videoFile").click(function(event) {
				$("#videoChooser").click();
				event.preventDefault();
			});

			video = $("#video1").get(0);
			$("#videoChooser").on("change", function(event) {
				var videoFile = event.target.files[0];
				video.src = URL.createObjectURL(videoFile);
				$("#mediaList").show();
			});
			
			$("#mediaList").hide();
			
			
			$("#mediaList").empty();
			$("#mediaList").append($("<option></option>").attr("value", "-1").text("Choose one..."));
			media.forEach(function(medium) {
				$("#mediaList").append($("<option></option>")
						.attr("value", medium.get("id"))
						.text(medium.get("title")));
			});
				
			$("#chapterList")
			.tree({
				data: [],
				autoOpen: true,
				selectable: true
			})
			.bind("tree.contextmenu", function(event) {
				var sectionId = event.node.id,
					section,
					start, end;
					
				if (sectionId === "-1") {
					$("#intervalControls").hide();

					$("#chapterTitle").val(medium.title);
					$("#chapterDescription").val("");
					$("#chapterStart").text("00:00:00");
					$("#chapterEnd").text(medium.duration);
				} else {
					section = sections.findById(sectionId);

					start = timeToSeconds(section.get("start")),
					end = timeToSeconds(section.get("end"));
					$("#interval").slider("option", "values", [start, end]);
					$("#intervalControls").show();

					$("#chapterTitle").val(section.get("title"));
					$("#chapterDescription").val(section.get("description"));
					$("#chapterStart").text(section.get("start"));
					$("#chapterEnd").text(section.get("end"));

				}

				if (doubleSelected) {
					$(doubleSelected.element).find('.jqtree-title').removeClass("doubleSelected");
				}
				
				doubleSelected = event.node;
				$(doubleSelected.element).find('.jqtree-title:first').addClass("doubleSelected");

				selectedSectionId = sectionId;				
			})
			.bind('tree.select', function(event) {
				var sectionId = event.node.id,
					start, end,
					path = [medium.title];
				
				if (sectionId === "-1") {
					start = 0,
					end = timeToSeconds(medium.duration);

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
					
					$("#currentlyShowing").text(medium.title);
					
					if (doubleSelected) {
						$(doubleSelected.element).find('.jqtree-title').removeClass("doubleSelected");
					}
				} else {
					section = sections.findById(sectionId);
					
					start = timeToSeconds(section.get("start")),
					end = timeToSeconds(section.get("end"));
					
					$("#seeker").slider("option", "min", start);
					$("#seeker").slider("option", "max", end);
					
					$("#seeker").slider("value", start);
					
					$("#video1").get(0).currentTime = start;

					$("#interval").slider("option", "min", start);
					$("#interval").slider("option", "max", end);		
					$("#interval").slider("option", "values", [start, end]);
										
					$("#intervalControls").hide();

					$("#chapterTitle").val("");
					$("#chapterDescription").val("");
					$("#chapterStart").text("");
					$("#chapterEnd").text("");
					
					path = path.concat(findPathUntil(medium, sectionId));
					$("#currentlyShowing").text(path.join(' / '));
				}
			});
			
			$("#mediaList").change(function() {
				self.app.selectedMedium = media.findById($(this).val());
				
				if (self.app.selectedMedium.get("id") === "-1") {
					updateTree([], "");
				} else {
					medium = {
							id: self.app.selectedMedium.get("id"),
							title: self.app.selectedMedium.get("title"),
							duration: self.app.selectedMedium.get("duration"),
							sections: sections.asTree(self.app.selectedMedium.get("id"))
					};

					updateTree(convertMediumtoTree(medium), medium.title);
					var node = $("#chapterList").tree('getNodeById', "-1");
					$("#chapterList").tree("selectNode", node);
				}
			});

			$("#seeker").slider({
				value: 0,
				disabled: true,
				slide: function(event, ui) {
					video.currentTime = ui.value;	
				}
			});

			$("#interval").slider({
				range: true,
				disabled: false,
				slide: function(event, ui) {
					var start = secondsToTime(ui.values[0]),
						end = secondsToTime(ui.values[1]);
					$("#chapterStart").val(start);
					$("#chapterEnd").val(end);
				},
				stop: function(event, ui) {
					var start = secondsToTime(ui.values[0]),
						end = secondsToTime(ui.values[1]),
						sectionId = selectedSectionId,
						url = "/media/" + medium.id + "/chapters/" + sectionId;
					
					sections.updateById(sectionId, {"start": start, "end": end });
					
					$.post(url, {"newStart": start, "newEnd": end });
				}
			});
			
			$("#intervalControls").hide();
						
			video.addEventListener('durationchange', function() {
				$("#seeker").slider("option", "disabled", false);
				$("#seeker").slider("option", "min", 0);
				$("#seeker").slider("option", "max", video.duration);

				$("#interval").slider("option", "min", 0);
				$("#interval").slider("option", "max", video.duration);		
				$("#interval").slider("option", "values", [0, video.duration]);
			});
			
			video.addEventListener('timeupdate', function() {
				$("#seeker").slider("value", video.currentTime);
			});
			
			video.addEventListener('timeupdate', function() {
				$("#current").text(secondsToTime(video.currentTime));
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