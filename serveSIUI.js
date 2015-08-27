var bodyParser = require('body-parser');
var app = require('express')();
var http = require('http').Server(app);
var cors = require('cors')
var net = require('net');
var fs = require('fs');


parts = process.argv

if (parts.length < 4)
{
	console.log("usage: node serveSIUI.js [HTTP PORT] [SIUI_IP]")
	process.exit(1);
}

hp = parts[2]
sp = parts[3]

//set the bait
rolling = ""
test = [1,0,0,0,9,0,25,0,0] //001 000 000 000 009 000 025
bait = ""
for (t in test) bait += test[t].toString()+","
console.log(bait)

http.listen(hp);


//Enable Cross Site Scripting
app.use(cors())



//thanks http://blog.matthewdfuller.com/2014/10/nodejs-error-too-many-parameters-at.html
app.use(bodyParser.urlencoded({
        extended: false,
     parameterLimit: 100000000,
     limit: 1024 * 1024 * 100000000000
}));
app.use(bodyParser.json({
        extended: false,
     parameterLimit: 10000000000,
     limit: 1024 * 1024 * 1000000000
}));


app.post('/toSIUI',function(req,res){
	x = req.body
	toSend = x['data']
	buf = new Buffer(toSend)
	console.log(buf.length);
	client.write(buf);
	res.send(x);
	
});

//weak interface
app.get('/data/', function(req, res){
	res.send(out.toString('utf8'))
});


app.get('/getbuffer/', function(req, res){
	res.send("buffer length is "+sneakarr.length)
	console.log(sneakarr.length)
});


app.get('/clearbuffer/', function(req, res){
	sneakarr = [];
	res.send("buffer cleared")
	
});

app.get('/sendbuffer/', function(req, res){
	for (var i = 0; i < sneakarr.length; i++) client.write(new Buffer(sneakarr[i]))
	res.send("sent buffer of length "+sneakarr.length)

});

app.get('/sendcmd/*', function(req, res){
	toSend = req.originalUrl.replace("/sendcmd/","")
	console.log(toSend)
	fs.readFile(toSend+".scmd",function(err,inp)
	{
		arr = JSON.parse(inp)
		for (var i = 0; i < arr.length; i++) client.write(new Buffer(arr[i]))
		res.send("sent buffer of length "+sneakarr.length)
	});
	
});

app.get('/setGain/*', function(req, res){
	toSend = req.originalUrl.replace("/setGain/","")*10
	
	b2 = Math.floor(toSend/255)
	b1 = toSend%255 - b2
	console.log(toSend)
	fs.readFile("000db.scmd",function(err,inp)
	{
		arr = JSON.parse(inp)
		arr[0][48] = b1
		arr[0][49] = b2
		for (var i = 0; i < arr.length; i++) client.write(new Buffer(arr[i]))
		res.send("sent buffer of length "+sneakarr.length)
	});
	
});



oldlen = 0

setInterval(function(){
	if (sneakarr.length == oldlen & oldlen != 0)
	{
		console.log(sneakarr.length)
		fs.writeFile("temp_"+Date.now()+".scmd",JSON.stringify(sneakarr));
		sneakarr = []
		console.log("cleared buffer")
		
	}
	oldlen = sneakarr.length
}, 1000)


app.get('/markin/*', function(req, res){
	toSend = req.originalUrl.replace("/markin/","")
	console.log(toSend)
	fs.writeFile(toSend+".scmd",JSON.stringify(sneakarr));
	res.send(toSend)
	
});

//temp holding array for sniffer
var sneakarr = []

var out = ""
var client = new net.Socket();
var socker = new net.Socket()
var server = net.createServer(function(c) { //'connection' listener
	socker = c
	console.log('SIUI connected');

	c.on('data', function(data) {
		client.write(data)
		arrtron = []
		for (var i = 0; i < data.length; i++) arrtron.push(data[i])
		sneakarr.push(arrtron)
	});
	
	//Socket Functions (e.g. what the crappy SIUI interface is doing)
	c.on('end', function() {
		console.log('SIUI disconnected');
	});

	
});

server.listen(6000, function() { //'listening' listener
			console.log('server bound');
			client.connect(6000, sp, function() {
				console.log('Connected');
			});
			
	});


//Client functions (e.g. what the SIUI is doing)
client.on('data', function(data) {

	for (var i = 0; i < data.length; i++)
	{
		rolling += data[i]+","
	}
	if (rolling.length > 40000) rolling = rolling.substr(rolling.length-10000);

	//pass data to interface
	try
	{
		socker.write(data)
	}
	catch (e)
	{
		something = "unhappy" 
	}

	markin = rolling.indexOf(bait)
	markout = rolling.indexOf(bait,markin+10)

	if (markin < markout) out = rolling.substring(markin,markout)
	//store last data for web interface

});


client.on('close', function() {
	console.log('Connection closed');
});
	


