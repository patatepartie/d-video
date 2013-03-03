define(['jquery', 'jquery.ui', 'jquery.jstree'], function($) {
	var App = function() {
		var selectedNode = {},
			doubleSelected = null,
			medium = {};
		
		function convertChapterstoTree(chapters) {
			var tree = [{
					"data": "Media",
					"attr": {
						"id": "-1",
						"start": "00:00:00",
						"end": chapters.duration
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
						"id": chapter.id,
						"title": chapter.title,
						"description": chapter.description,
						"start": chapter.start,
						"end": chapter.end
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
		
		function findChapter(medium, chapterId) {
			var results = findAll(medium.chapters, chapterId);

			if (results.length != 1) {
				throw "Cannot find chapter with title '" + chapterId + "' in medium '" + medium.title + "'";
			}

			return results[0];
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

			$("#chapterList")
				.bind("select_node.jstree", function(event, data) {
					var selectedItem = data.rslt.obj,
						start = timeToSeconds(selectedItem.attr("start")),
						end = timeToSeconds(selectedItem.attr("end"));
					$("#interval").slider("option", "values", [start, end]);
					$("#intervalControls").show();
	
					$("#chapterTitle").val(selectedItem.attr("title"));
					$("#chapterDescription").val(selectedItem.attr("description"));
					$("#chapterStart").text(selectedItem.attr("start"));
					$("#chapterEnd").text(selectedItem.attr("end"));
					
					selectedNode = selectedItem;
				})
				.on("dblclick", "a", function(event) {
					var selectedItem = $(this).parent(),
						start = timeToSeconds(selectedItem.attr("start")),
						end = timeToSeconds(selectedItem.attr("end")),
						selectedId = selectedItem.attr("id"),
						path = [medium.title];
					$("#seeker").slider("option", "min", start);
					$("#seeker").slider("option", "max", end);
					
					$("#seeker").slider("value", start);
					
					video.currentTime = start;
	
					$("#interval").slider("option", "min", start);
					$("#interval").slider("option", "max", end);		
					$("#interval").slider("option", "values", [start, end]);
										
					$("#intervalControls").hide();
	
					$("#chapterTitle").val("");
					$("#chapterDescription").val("");
					$("#chapterStart").text("");
					$("#chapterEnd").text("");
					
					path = path.concat(findPathUntil(medium, selectedId));
					$("#currentlyShowing").text(path.join(' / '));
					
					$("#chapterList").jstree("clean_node", -1);
					
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
						"data": []
					},
					"ui": {
						"select_limit": 1,
						"select_range_modifier": false,
						"select_multiple_modifier": false
					}
				});
		
			$.getJSON("/media", function(data) {
				$("#mediaList").empty();
				$("#mediaList").append($("<option></option>").attr("value", "-1").text("Choose one..."));
				data.forEach(function(medium) {
					$("#mediaList").append($("<option></option>").attr("value", medium.id).text(medium.title));					
				});				
			});
				
			$("#mediaList").change(function() {
				var id = $(this).val();
				if (id === "-1") {
					var jsTreeSettings = $("#chapterList").jstree("get_settings");
					jsTreeSettings.json_data.data = [];
					$.jstree._reference("chapterList")._set_settings(jsTreeSettings);
					
					$("#chapterList").jstree("refresh");
					
					$("#currentlyShowing").text("");	
				} else {
					$.getJSON("/media/" + id + "/chapters", function(data) {
						medium = data;
						
						var jsTreeSettings = $("#chapterList").jstree("get_settings");
						jsTreeSettings.json_data.data = convertChapterstoTree(medium);
						$.jstree._reference("chapterList")._set_settings(jsTreeSettings);
						
						$("#chapterList").jstree("refresh");
						
						$("#currentlyShowing").text(medium.title);
					});
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
						chapterId = selectedNode.attr("id"),
						url = "/media/" + medium.id + "/chapters/" + chapterId;
					
					var selectedChapter = findChapter(medium, chapterId);
					selectedChapter.start = start;
					selectedChapter.end = end;
					
					var jsTreeSettings = $("#chapterList").jstree("get_settings");
					jsTreeSettings.json_data.data = convertChapterstoTree(medium);
					$.jstree._reference("chapterList")._set_settings(jsTreeSettings);
					
					$("#chapterList").jstree("refresh");
					
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