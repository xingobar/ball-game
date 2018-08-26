var canvas = document.getElementById('ball_canvas');
var ctx = canvas.getContext('2d');

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;

function drawerBall() {
	ctx.beginPath();
	ctx.arc(x, y, 15, 0, Math.PI * 2, false);
	ctx.fillStyle = 'blue';
	ctx.fill();
	ctx.closePath();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawerBall();
	x += dx;
	y += dy;
}

setInterval(function() {
	draw();
}, 10);
