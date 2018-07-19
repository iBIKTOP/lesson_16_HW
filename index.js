var http = require('http');
var fs = require('fs');
var Event = require("events").EventEmitter;
var emt = new Event();

function AnalogClock(){
	var hour = 0;
	var minute = 0;
	var second = 0;

	setInterval(function () {
		if (this.getSecond()<59) second++;
		else{
			second = 0;
			if (this.getMinute()<59) minute++;
			else{
				minute = 0;
				if (this.getHour()<11) hour++;
				else{
					hour = 0;
				}
			}
		}
	}.bind(this),1000);

	this.setHour = function (h) {
		if (h>11) hour=0;
		else hour = h;
	}

	this.setMinute = function (m) {
		if (m>59) {
			minute = m - 60;
			emt.emit('hour++');
		}
		else minute = m;
	}

	this.setSecond = function (s) {
		if (s>59) {
			second = s - 60;
			emt.emit('minute++');
		}
		else second = s;
	}

	this.getHour = function() {
		return hour;
	}

	this.getMinute = function() {
		return minute;
	}
	
	this.getSecond = function() {
		return second;
	}
	this.time = function () {
		return hour+':'+minute+':'+second;	
	}
}

var analogClock = new AnalogClock();

emt.on('hour++', function() {
    analogClock.setHour(analogClock.getHour() + 1);
});
emt.on('minute++', function() {
    analogClock.setMinute(analogClock.getMinute() + 1);
});
emt.on('second++', function() {
    analogClock.setSecond(analogClock.getSecond() + 1);
});

http.createServer(function (req,res) {
	// var data = fs.readFileSync('clock.html', 'utf8');
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
    if (req.url==='/'){
			res.write(analogClock.time()+"<a href='/'> Обновить</a><br>");
			res.write('<a href="/hour++">Увеличить время на 1 час</a><br>');
			res.write('<a href="/minute++">Увеличить время на 1 мин</a><br>');
			res.write('<a href="/second++">Увеличить время на 1 сек</a><br>');
	}
	if (req.url==='/hour++'){
		emt.emit('hour++');

		res.write(analogClock.time()+"<a href='/'> Обновить</a><br>");
		res.write('<a href="/hour++">Увеличить время на 1 час</a><br>');
		res.write('<a href="/minute++">Увеличить время на 1 мин</a><br>');
		res.write('<a href="/second++">Увеличить время на 1 сек</a><br>');
	}

	if (req.url==='/minute++'){
		emt.emit('minute++');

		res.write(analogClock.time()+"<a href='/'> Обновить</a><br>");
		res.write('<a href="/hour++">Увеличить время на 1 час</a><br>');
		res.write('<a href="/minute++">Увеличить время на 1 мин</a><br>');
		res.write('<a href="/second++">Увеличить время на 1 сек</a><br>');
	}
	
	if (req.url==='/second++'){
		emt.emit('second++');

		res.write(analogClock.time()+"<a href='/'> Обновить</a><br>");
		res.write('<a href="/hour++">Увеличить время на 1 час</a><br>');
		res.write('<a href="/minute++">Увеличить время на 1 мин</a><br>');
		res.write('<a href="/second++">Увеличить время на 1 сек</a><br>');
	}
	res.end();
}).listen(3000, function () {
	console.log('Серевер работает на localhost:3000');
})






