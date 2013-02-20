$(function() {
	var video = document.getElementById("video1");
	
	$( "#chapterList" ).jstree({
		plugins: ["json_data", "themes"],
		core: {
		},
		json_data: {
			"data": [
		         {
		        	 "data": "Root",
		        	 "attr": {"id": "1"},
		        	 "state": "open",
		        	 "children": [
		        	      {
		        	    	  "data": "Child 1",
		        	    	  "attr": {"id": "2"},
		        	    	  "state": "open"
		        	      },
		        	      {
		        	    	  "data": "Child 2",
		        	    	  "attr": {"id": "3"},
		        	    	  "state": "open",
		        	    	  "children": [
									{
										  "data": "Child 2 - 1",
										  "attr": {"id": "4"}
									},
									{
										  "data": "Child 2 - 2",
										  "attr": {"id": "5"}
									}
		        	    	  ] 
		        	      }
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