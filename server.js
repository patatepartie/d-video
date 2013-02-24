var express = require('express'), 
	app;

app = express.createServer();

app.use(express.static('app'));
app.use('/videos/', express.static('videos'));
app.use('/js/lib/', express.static('node_modules/requirejs'));
app.use('/node_modules', express.static('node_modules'));

app.listen(8880);

console.log('Running on http://localhost:8880');
