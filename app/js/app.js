define(['jquery', 'jquery.ui', 'jquery.jstree'], function($) {
	var App = function() {
		$(function() {
			var video = $("#video1").get(0);
			
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
			
			$( "#chapterList" )
				.bind("select_node.jstree", function(event, data) {
					var selectedItem = data.rslt.obj,
						start = timeToSeconds(selectedItem.attr("start")),
						end = timeToSeconds(selectedItem.attr("end"));
					$("#interval").slider("option", "values", [start, end]);
					$("#interval").slider("option", "disabled", false);

					$("#chapterTitle").val(selectedItem.attr("id"));
					$("#chapterDescription").val(selectedItem.attr("description"));
					$("#chapterStart").val(selectedItem.attr("start"));
					$("#chapterEnd").val(selectedItem.attr("end"));
				})
				.on("dblclick", "a", function(event) {
					var selectedItem = $(this).parent(),
						start = timeToSeconds(selectedItem.attr("start")),
						end = timeToSeconds(selectedItem.attr("end"));
					$("#seeker").slider("option", "min", start);
					$("#seeker").slider("option", "max", end);
					
					$("#seeker").slider("value", start);
					
					var video = document.getElementById("video1");
					video.currentTime = start;

					$("#interval").slider("option", "disabled", true);
					$("#interval").slider("option", "min", start);
					$("#interval").slider("option", "max", end);		
					$("#interval").slider("option", "values", [start, end]);

					$("#chapterTitle").val("");
					$("#chapterDescription").val("");
					$("#chapterStart").val("");
					$("#chapterEnd").val("");
				})
				.jstree({
					plugins: ["json_data", "themes", "ui"],
					core: {
					},
					json_data: {
						"data": [
					         {
					        	 "data": "Media",
					        	 "attr": {
					        		 "id": "media",
					        		 "start": "00:00:00",
					        		 "end": "03:26:16"
					        	 },
					        	 "state": "open",
					        	 "children": [
					        	      {
					        	    	  "data": "Ebisu",
					        	    	  "attr": {
					        	    	  	"id": "Ebisu", 
					        	    	  	"description": "Oi-san and Moshieu explains Ebisu circuit to X and Yamanda-san",
					        	    	  	"start": "00:00:00",
					        	    	  	"end": "01:33:33"
					        	    	  }
					        	      },
					        	      {
					        	    	  "data": "Tsukuba Nismo",
					        	    	  "attr": {
												"id": "Tsukuba Nismo",
												"start": "01:35:19",
												"end": "01:53:56"
											}
					        	      },
					        	      {
					        	    	  "data": "Tsukuba Interclub",
					        	    	  "attr": {
												"id": "Tsukuba Interclub",
												"description": "SCCJ History Car Race",
												"start": "01:57:56",
												"end": "02:14:24"
											}
					        	      },
					        	      {
					        	    	  "data": "Okayama",
					        	    	  "attr": {
												"id": "Okayama",
												"start": "02:38:00",
												"end": "02:51:48"
											},
					        	    	  "state": "open",
					        	    	  "children": [
						        	    		{
												  "data": "NSX",
												  "attr": {
														"id": "NSX",
														"start": "02:38:00",
														"end": "02:46:07"
													}
												},
												{
												  "data": "Integra",
												  "attr": {
														"id": "Integra",
														"start": "02:46:08",
														"end": "02:51:48"
													}
												}
					        	    	  ]
					        	      },
					        	 ]
					         }
						]
					}
				});

			$( "#seeker" ).slider({
				value: 0,
				disabled: true,
				create: function(event, ui) {
					video.src = 'videos/any.mkv';
				},
				slide: function(event, ui) {
					var video = document.getElementById("video1");
					video.currentTime = ui.value;	
				}
			});

			$( "#interval" ).slider({
				range: true,
				disabled: true,
				slide: function(event, ui) {
					$("#chapterStart").val(secondsToTime(ui.values[0]));
					$("#chapterEnd").val(secondsToTime(ui.values[1]));
				}
			});
			
			video.addEventListener('durationchange', function() {
				var video = document.getElementById("video1");
				$("#seeker").slider("option", "disabled", false);
				$("#seeker").slider("option", "min", 0);
				$("#seeker").slider("option", "max", video.duration);

				$("#interval").slider("option", "min", 0);
				$("#interval").slider("option", "max", video.duration);		
				$("#interval").slider("option", "values", [0, video.duration]);
			});

			video.addEventListener('timeupdate', function() {
				var video = document.getElementById("video1");
				$("#seeker").slider("value", video.currentTime);
			});
			
			video.addEventListener('timeupdate', function() {
				var video = document.getElementById("video1");
				$("#current").text(secondsToTime(video.currentTime));
			});

			$( "#speed" ).slider({
				orientation: "vertical",
				range: "min",
				min: 0,
				max: 3,
				step: 0.5,
				value: 1,
				slide: function( event, ui ) {
					var video = document.getElementById("video1");
					video.playbackRate = ui.value;
				}
			});

			$("#play").click(function() {
				var video = document.getElementById("video1");
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