$(function() {
	var video = document.getElementById("video1");
	
	function timeToSeconds(time) {
		var components = time.split(":").map(function(item) {
			return parseInt(item);
		});
		return ((components[0] * 60) + components[1]) * 60 + components[2]; 
	}
	
	$( "#chapterList" )
//		.bind("select_node.jstree", function(event, data) {
//			$("#seeker").slider("option", "range", true);
//			var selectedItem = data.rslt.obj;
//			$("#seeker").slider("option", "values", [timeToSeconds(selectedItem.attr("start")), timeToSeconds(selectedItem.attr("end"))]);
//		})
		.on("dblclick", "a", function(event) {
			var selectedItem = $(this).parent(),
				start = timeToSeconds(selectedItem.attr("start")),
				end = timeToSeconds(selectedItem.attr("end"));
			$("#seeker").slider("option", "min", start);
			$("#seeker").slider("option", "max", end);
			
			$("#seeker").slider("value", start);
			
			var video = document.getElementById("video1");
			video.currentTime = start;
		})
		.jstree({
			plugins: ["json_data", "themes", "ui"],
			core: {
			},
			json_data: {
				"data": [
			         {
			        	 "data": "Media",
			        	 "attr": {"id": "media"},
			        	 "state": "open",
			        	 "children": [
			        	      {
			        	    	  "data": "Ebisu",
			        	    	  "attr": {
			        	    	  	"id": "Ebisu", 
			        	    	  	"description": "Oi-san and Moshieu explains Ebisu circuit to X and Yamanda-san",
			        	    	  	"start": "00:00:00",
			        	    	  	"end": "'01:33:33"
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
		slide: function( event, ui ) {
			var video = document.getElementById("video1");
			video.currentTime = ui.value;	
		}
	});

	video.addEventListener('durationchange', function() {
		$("#seeker").slider("option", "disabled", false);
		$("#seeker").slider("option", "min", 0);
		$("#seeker").slider("option", "max", video.duration);
	});

	video.addEventListener('timeupdate', function() {
		var video = document.getElementById("video1");
		$("#seeker").slider("value", video.currentTime);
	});
	
	video.addEventListener('timeupdate', function() {
		var video = document.getElementById("video1");
		$("#current").text(video.currentTime);
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