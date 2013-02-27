define(['jquery', 'jquery.ui', 'jquery.jstree'], function($) {
	var App = function() {
		var selectedNode = {};
		var media = {};
		
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
		
		function findChapter(media, chapterId) {
			var results = findAll(media.chapters, chapterId);

			if (results.length != 1) {
				throw "Cannot find chapter with title '" + chapterId + "'";
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

		$(function() {
			var video = $("#video1").get(0);
			
			$("#chapterList")
				.bind("select_node.jstree", function(event, data) {
					var selectedItem = data.rslt.obj,
						start = timeToSeconds(selectedItem.attr("start")),
						end = timeToSeconds(selectedItem.attr("end"));
					$("#interval").slider("option", "values", [start, end]);
					$("#interval").slider("option", "disabled", false);
					$("#interval").show();
	
					$("#chapterTitle").val(selectedItem.attr("title"));
					$("#chapterDescription").val(selectedItem.attr("description"));
					$("#chapterStart").val(selectedItem.attr("start"));
					$("#chapterEnd").val(selectedItem.attr("end"));
					
					selectedNode = selectedItem;
				})
				.on("dblclick", "a", function(event) {
					var selectedItem = $(this).parent(),
						start = timeToSeconds(selectedItem.attr("start")),
						end = timeToSeconds(selectedItem.attr("end"));
					$("#seeker").slider("option", "min", start);
					$("#seeker").slider("option", "max", end);
					
					$("#seeker").slider("value", start);
					
					video.currentTime = start;
	
					$("#interval").slider("option", "min", start);
					$("#interval").slider("option", "max", end);		
					$("#interval").slider("option", "values", [start, end]);
					$("#interval").slider("option", "disabled", true);
					$("#interval").hide();
	
					$("#chapterTitle").val("");
					$("#chapterDescription").val("");
					$("#chapterStart").val("");
					$("#chapterEnd").val("");
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
		
			$.getJSON("/chapters", function(data) {
				console.log(data);
				media = data;
				
				var jsTreeSettings = $("#chapterList").jstree("get_settings");
				jsTreeSettings.json_data.data = convertChapterstoTree(media);
				$.jstree._reference("chapterList")._set_settings(jsTreeSettings);
				
				$("#chapterList").jstree("refresh");
			});
				

			$("#seeker").slider({
				value: 0,
				disabled: true,
				create: function(event, ui) {
					video.src = 'videos/any.mkv';
				},
				slide: function(event, ui) {
					video.currentTime = ui.value;	
				}
			});

			$("#interval").slider({
				range: true,
				disabled: true,
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
						url = "/chapter/" + chapterId;
					
					var selectedChapter = findChapter(media, chapterId);
					selectedChapter.start = start;
					selectedChapter.end = end;
					
					var jsTreeSettings = $("#chapterList").jstree("get_settings");
					jsTreeSettings.json_data.data = convertChapterstoTree(media);
					$.jstree._reference("chapterList")._set_settings(jsTreeSettings);
					
					$("#chapterList").jstree("refresh");
					
					$.post(url, {"newStart": start, "newEnd": end });
				}
			});
			$("#interval").hide();
			
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