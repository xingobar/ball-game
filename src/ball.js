var canvas = document.getElementById('ball_canvas');
var ctx = canvas.getContext('2d');

var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 10;
var dx = 2;
var dy = -2;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

document.addEventListener('keydown', keydownHandler, false);
document.addEventListener('keyup', keyupHandler, false);

function drawerBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
	ctx.fillStyle = 'blue';
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = '#0095DD';
	ctx.fill();
	ctx.closePath();
}

function keyupHandler(e) {
	if (e.keyCode === 39) {
		rightPressed = false;
	}

	if (e.keyCode === 37) {
		leftPressed = false;
	}
}

function keydownHandler(e) {
	if (e.keyCode === 39) {
		rightPressed = true;
	}

	if (e.keyCode === 37) {
		leftPressed = true;
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawerBall();
	drawPaddle();

	// 因為碰撞偵測位於球的中心，因此得減掉半徑
	if (y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
		dy = -dy;
	}

	if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
		dx = -dx;
	}

	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	}

	if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}

	x += dx;

	y += dy;
}

setInterval(function() {
	draw();
}, 10);
