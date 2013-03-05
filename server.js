var express = require('express'), 
	app = express(),
	media = [
		{
			"id": "revspeed-2009-09",
			"title": "Revspeed-0909",
			"duration" : "03:26:16"
		},
		{
			"id": "revspeed-2009-10",
			"title": "Revspeed-0910",
			"duration" : "03:26:16"
		}
	],
	sections = [
		{
			"id": "0",
			"parent": "revspeed-2009-09",
			"title" : "Ebisu",
			"description" : "Oi-san and Moshieu explains Ebisu circuit to X and Yamanda-san",
			"start" : "00:00:00",
			"end" : "01:33:33"
		}, {
			"id": "1",
			"parent": "revspeed-2009-09",
			"title" : "Tsukuba Nismo",
			"start" : "01:35:19",
			"end" : "01:53:56"
		}, {
			"id": "2",
			"parent": "revspeed-2009-09",
			"title" : "Tsukuba Interclub",
			"description" : "SCCJ History Car Race",
			"start" : "01:57:56",
			"end" : "02:14:24"
		}, {
			"id": "3",
			"parent": "revspeed-2009-09",
			"title" : "Okayama",
			"start" : "02:38:00",
			"end" : "02:51:48"
		}, {
			"id": "3_0",
			"parent": "3",
			"title" : "NSX",
			"start" : "02:38:00",
			"end" : "02:46:07"
		}, {
			"id": "3_1",
			"parent": "3",
			"title" : "Integra",
			"start" : "02:46:08",
			"end" : "02:51:48"
		}, {
			"id": "3_0_0",
			"parent": "3_0",
			"title" : "NSX 2",
			"start" : "02:38:00",
			"end" : "02:40:00"
		}, {
			"id": "4",
			"parent": "revspeed-2009-10",
			"title" : "Other",
			"start" : "00:00:00",
			"end" : "01:33:33"
		}
	];

app.use(express.static('app'));
app.use(express.bodyParser());

app.use('/js/lib/', express.static('node_modules/requirejs'));
app.use('/node_modules', express.static('node_modules'));

app.get('/media', function(req, res) {
	console.log('Request: media');
	res.setHeader('Content-Type', 'application/json');
	
	res.send(media);
});

app.get('/media/:id/chapters', function(req, res) {
	var sectionTree;
	
	console.log('Request: chapters for medium ' + req.params.id);
	
	res.setHeader('Content-Type', 'application/json');
	sectionTree = sections.filter(function(section) {
		return section.parent === req.params.id;
	});
	
	appendSubSections(sectionTree);
		
	res.send(sectionTree);
});
app.post('/media/:mediumId/chapters/:chapterId', function(req, res) {
	var mediumId = req.params.mediumId,
		chapterId = req.params.chapterId,
		chapter;
		
	console.log('Request: chapter ' + chapterId + ' in medium ' + mediumId);

	chapter = sections.filter(function(section) {
		return belongsTo(section, mediumId) && section.id === chapterId;
	})[0];
	
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

function appendSubSections(nodes) {
	if (nodes !== undefined) {
		nodes.forEach(function(section) {
			var results = sections.filter(function(subSection) {
				return subSection.parent === section.id;
			});
			if (results.length > 0) {
				section.chapters = results;
				appendSubSections(results);
			}
		});
	}
}

function belongsTo(section, mediumId) {
	return section.parent === mediumId || belongsTo(getSection(section.parent), mediumId);
}

function getSection(sectionId) {
	return sections.filter(function(section) {
		return section.id === sectionId;
	})[0];
}

app.listen(8880);

console.log('Running on http://localhost:8880');
