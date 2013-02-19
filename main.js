$(function() {
	var video = document.getElementById("video1");
	
	$( "#chapterList" ).jstree({
		plugins: ["themes","json_data","ui"],
		core: {

		},
		json_data: {
			"data": {
				"title": "root"
			}
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