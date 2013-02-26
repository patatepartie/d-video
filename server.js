var express = require('express'), 
	app = express(), 
	media = {
		"duration" : "03:26:16",
		"chapters" : [
			{
				"id": "0",
				"title" : "Ebisu",
				"description" : "Oi-san and Moshieu explains Ebisu circuit to X and Yamanda-san",
				"start" : "00:00:00",
				"end" : "01:33:33"
			}, {
				"id": "1",
				"title" : "Tsukuba Nismo",
				"start" : "01:35:19",
				"end" : "01:53:56"
			}, {
				"id": "2",
				"title" : "Tsukuba Interclub",
				"description" : "SCCJ History Car Race",
				"start" : "01:57:56",
				"end" : "02:14:24"
			}, {
				"id": "3",
				"title" : "Okayama",
				"start" : "02:38:00",
				"end" : "02:51:48",
				"chapters" : [ {
					"id": "3_0",
					"title" : "NSX",
					"start" : "02:38:00",
					"end" : "02:46:07"
				}, {
					"id": "3_1",
					"title" : "Integra",
					"start" : "02:46:08",
					"end" : "02:51:48"
				} ]
			} 
		]
	};

app.use(express.static('app'));
app.use(express.bodyParser());

app.use('/videos/', express.static('videos'));
app.use('/js/lib/', express.static('node_modules/requirejs'));
app.use('/node_modules', express.static('node_modules'));

app.get('/chapters', function(req, res) {
	console.log('Request: chapters');
	
	res.setHeader('Content-Type', 'application/json');
	
	res.send(media);
});
app.post('/chapter/:id', function(req, res) {
	var chapter = findChapter(req.params.id);
	
	console.log('Request: chapter ' + req.params.id);

	if (req.body.newStart) {
		chapter.start = req.body.newStart;
	}
	
	if (req.body.newEnd) {
		chapter.end = req.body.newEnd;
	}
	
	res.send('OK');
});
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.send(500, 'Something broke!');
});

function findChapter(chapterId) {
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

app.listen(8880);

console.log('Running on http://localhost:8880');
