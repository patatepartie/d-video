var express = require('express'), 
	app = express(), 
	chapters = {
	"duration" : "03:26:16",
	"chapters" : [
			{
				"title" : "Ebisu",
				"description" : "Oi-san and Moshieu explains Ebisu circuit to X and Yamanda-san",
				"start" : "00:00:00",
				"end" : "01:33:33"
			}, {
				"title" : "Tsukuba Nismo",
				"start" : "01:35:19",
				"end" : "01:53:56"
			}, {
				"title" : "Tsukuba Interclub",
				"description" : "SCCJ History Car Race",
				"start" : "01:57:56",
				"end" : "02:14:24"
			}, {
				"title" : "Okayama",
				"start" : "02:38:00",
				"end" : "02:51:48",
				"chapters" : [ {
					"title" : "NSX",
					"start" : "02:38:00",
					"end" : "02:46:07"
				}, {
					"title" : "Integra",
					"start" : "02:46:08",
					"end" : "02:51:48"
				} ]
			} ]
}, Arboreal = require('arboreal');

app.use(express.static('app'));
app.use('/videos/', express.static('videos'));
app.use('/js/lib/', express.static('node_modules/requirejs'));
app.use('/node_modules', express.static('node_modules'));
app.use(express.bodyParser());
app.get('/chapters', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(chapters);
	console.log(chapters);
});
app.post('/chapter/:id', function(req, res) {
	var chapter = findChapter(req.params.id);

	if (req.body.newStart) {
		chapter.start = req.body.newStart;
	}
	
	if (req.body.newEnd) {
		chapter.end = req.body.newEnd;
	}
	
	console.log(chapter);

	res.send('OK');
});
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.send(500, 'Something broke!');
});

function findChapter(chapterId) {
	var tree = Arboreal.parse(chapters, 'chapters'), 
		result = tree.find(function(node) {
				return node.data.title === chapterId;
			});

	if (!result) {
		throw "Cannot find chapter with title '" + chapterId + "'";
	}

	return result.data;
}

app.listen(8880);

console.log('Running on http://localhost:8880');
