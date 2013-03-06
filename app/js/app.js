define(['jquery', 'jquery.ui', 'jquery.jstree'], function($) {
	var App = function() {
		var selectedSectionId = "-1",
			doubleSelected = null,
			medium = {};
		
		function convertChapterstoTree(chapters) {
			var tree = [{
					"data": "Media",
					"attr": {
						"id": "-1"
					},
					"state": "open"
				}
			];

			var node = tree[0];
			node.children = chapters.chapters.map(function(chapter) {
				return convertSubChapterToChildren(chapter);
			});

			return tree;
		}

		function convertSubChapterToChildren(chapter) {
			var child = {
					"data": chapter.title,
					"attr": {
						"id": chapter.id
					}
				};
				if (chapter.chapters) {
					child.state = "open";
					child.children = chapter.chapters.map(function(chapter) {
						return convertSubChapterToChildren(chapter);
					});
				}

			return child;
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
		
		function findAll(chapters, chapterId) {
			var results = [];
			chapters.forEach(function(chapter) {
				if (chapter.id === chapterId) {
					results.push(chapter);
				}
				
				if (chapter.chapters) {
					results = results.concat(findAll(chapter.chapters, chapterId));
				}
			});
			
			return results;
		}
		
		function findPathUntil(medium, chapterId) {
			var path = [];
			medium.chapters.forEach(function(child) {
				buildPath(path, child, chapterId);
			});
			
			return path;
		}
		
		function isInPathTo(queryChapter, chapterId) {
			if (isLeaf(queryChapter)) return false;
			
			var foundChapters = findAll(queryChapter.chapters, chapterId);
			return foundChapters.length > 0;
		}
		
		function isLeaf(chapter) {
			return !chapter.chapters || chapter.chapters.length === 0; 
		}
		
		function buildPath(path, chapter, chapterId) {
			if (chapter.id === chapterId) {
				path.push(chapter.title);
			} else if (isInPathTo(chapter, chapterId)) {
				path.push(chapter.title);
				chapter.chapters.forEach(function(child) {
					buildPath(path, child, chapterId);
				});
			}
		}

		function findSection(mediumId, sectionId) {
			var sections = JSON.parse(localStorage.getItem("sections"));
			return sections.filter(function(section) {
				return section.id === sectionId;
			})[0];
		}
		
		function updateSection(sectionId, sectionModifs) {
			var sections = JSON.parse(localStorage.getItem("sections"));
			var result = sections.filter(function(section) {
				return section.id === sectionId;
			})[0];
			
			if (sectionModifs.start) 
				result.start = sectionModifs.start;
			
			if (sectionModifs.end)
				result.end = sectionModifs.end;
			
			localStorage.setItem("sections", JSON.stringify(sections));
		}
		
		function createChapterList(tree) {
			$("#chapterList")
			.bind("select_node.jstree", function(event, data) {
				var selectedItem = data.rslt.obj,
					sectionId = selectedItem.attr("id"),
					section,
					start, end;
					
				if (sectionId === "-1") {
					$("#intervalControls").hide();

					$("#chapterTitle").val(medium.title);
					$("#chapterDescription").val("");
					$("#chapterStart").text("00:00:00");
					$("#chapterEnd").text(medium.duration);
				} else {
					section = findSection(medium.id, sectionId);

					start = timeToSeconds(section.start),
					end = timeToSeconds(section.end);
					$("#interval").slider("option", "values", [start, end]);
					$("#intervalControls").show();

					$("#chapterTitle").val(section.title);
					$("#chapterDescription").val(section.description);
					$("#chapterStart").text(section.start);
					$("#chapterEnd").text(section.end);

				}

				selectedSectionId = sectionId;				
			})
			.on("dblclick", "a", function(event) {
				var sectionId = $(this).parent().attr("id"),
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
				} else {
					section = findSection(medium.id, sectionId);
					
					start = timeToSeconds(section.start),
					end = timeToSeconds(section.end);
					
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
					
					$("#chapterList").jstree("clean_node", -1);
				}
				
				if (doubleSelected) {
					doubleSelected.removeClass("doubleSelected");
				}
				
				doubleSelected = $(this); 
				doubleSelected.addClass("doubleSelected");
			})
			.jstree({
				"plugins": ["json_data", "themes", "ui"],
				"core": {
				},
				"json_data": {
					"data": tree
				},
				"ui": {
					"select_limit": 1,
					"select_range_modifier": false,
					"select_multiple_modifier": false
				}
			});
		}
		
		function updateTree(tree, text) {
			$("#chapterList").jstree("destroy");
			createChapterList(tree);
			
			$("#currentlyShowing").text(text);
		}

		function buildSectionsTree(mediumId) {
			var allSections = JSON.parse(localStorage.getItem("sections"));
			var results = allSections.filter(function(section) {
				return section.parent === mediumId;
			});

			appendSubSections(allSections, results);

			return results;
		}

		function appendSubSections(allSections, nodes) {
			if (nodes !== undefined) {
				nodes.forEach(function(section) {
					var results = allSections.filter(function(subSection) {
						return subSection.parent === section.id;
					});
					if (results.length > 0) {
						section.chapters = results;
						appendSubSections(allSections, results);
					}
				});
			}
		}

		$(function() {
			var video = $("#video1").get(0);

			$("#mediaList").hide();

			$("#videoFile").click(function(event) {
				$("#videoChooser").click();
				event.preventDefault();
			});

			$("#videoChooser").on("change", function(event) {
				var videoFile = event.target.files[0];
				video.src = URL.createObjectURL(videoFile);
				$("#mediaList").show();
			});

			createChapterList([]);
		
			$.getJSON("/media", function(data) {
				localStorage.setItem("media", JSON.stringify(data));
				
				var media = JSON.parse(localStorage.getItem("media"));
				
				$("#mediaList").empty();
				$("#mediaList").append($("<option></option>").attr("value", "-1").text("Choose one..."));
				media.forEach(function(medium) {
					$("#mediaList").append($("<option></option>")
							.attr("value", medium.id)
							.data("duration", medium.duration)
							.text(medium.title));					
				});
			});

			$.getJSON("/sections", function(data) {
				localStorage.setItem("sections", JSON.stringify(data));
			});
				
			$("#mediaList").change(function() {
				var id = $(this).val(),
					selected = $(this).find("option:selected");
				
				if (id === "-1") {
					updateTree([], "");
				} else {
					medium = {
							id: id,
							title: selected.text(),
							duration: selected.data("duration"),
							chapters: buildSectionsTree(id)
					};

					updateTree(convertChapterstoTree(medium), medium.title);
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
					
					updateSection(sectionId, {"start": start, "end": end });
					
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
		});
	};

	App.prototype = {

	};

	return App;
});
