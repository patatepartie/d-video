var connect = require('connect'), 
	http = require('http'), 
	app;

app = connect()
	.use(connect.static('app'))
	.use('/videos/', connect.static('videos'))
	.use('/js/lib/', connect.static('lib'))
	.use('/node_modules', connect.static('node_modules'));

http.createServer(app).listen(8880, function() {
	console.log('Running on http://localhost:8880');
});