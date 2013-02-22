var connect = require('connect'), 
	http = require('http'), 
	app;

app = connect()
	.use(connect.static('app'))
	.use('/lib/', connect.static('lib'));

http.createServer(app).listen(8880, function() {
	console.log('Running on http://localhost:8880');
});