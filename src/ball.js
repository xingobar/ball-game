var canvas = document.getElementById('ball_canvas');
var ctx = canvas.getContext('2d');

var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 10;
var dx = 2;
var dy = -2;

function drawerBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
	ctx.fillStyle = 'blue';
	ctx.fill();
	ctx.closePath();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawerBall();

	// 因為碰撞偵測位於球的中心，因此得減掉半徑
	if (y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
		dy = -dy;
	}

	if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
		dx = -dx;
	}

	x += dx;

	y += dy;
}

setInterval(function() {
	draw();
}, 10);
