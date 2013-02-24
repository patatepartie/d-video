var express = require('express'), 
	app = express();

app.use(express.static('app'));
app.use('/videos/', express.static('videos'));
app.use('/js/lib/', express.static('node_modules/requirejs'));
app.use('/node_modules', express.static('node_modules'));
app.get('/chapters', function(req, res) {
	 var json = {
	 	"duration": "03:26:16",
	 	"chapters": [ {
	 			"title": "Ebisu",
	 			"description": "Oi-san and Moshieu explains Ebisu circuit to X and Yamanda-san",
	 			"start": "00:00:00",
	 			"end": "01:33:33"
	 		}, {
	 			"title": "Tsukuba Nismo",
	 			"start": "01:35:19",
	 			"end": "01:53:56"
	 		}, {
	 			"title": "Tsukuba Interclub",
	 			"description": "SCCJ History Car Race",
	 			"start": "01:57:56",
	 			"end": "02:14:24"
	 		}, {
	 			"title": "Okayama",
	 			"start": "02:38:00",
	 			"end": "02:51:48",
	 			"chapters": [{
	 					"title": "NSX",
	 					"start": "02:38:00",
	 					"end": "02:46:07"
	 				}, {
	 					"title": "Integra",
	 					"start": "02:46:08",
	 					"end": "02:51:48"
	 				}
	 			]
	 		}
	 	]				 
	 };

	res.setHeader('Content-Type', 'application/json');
	res.send(json);
});

app.listen(8880);

console.log('Running on http://localhost:8880');
