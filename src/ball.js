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

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

document.addEventListener('keydown', keydownHandler, false);
document.addEventListener('keyup', keyupHandler, false);

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (var r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}

function bricksCollision() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.status) {
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					// collision bricks
					b.status = 0;
					dy = -dy;
					score++;
					if (score == brickColumnCount * brickRowCount) {
						alert('YOU WIN!');
						document.location.reload();
					}
				}
			}
		}
	}
}

function drawBricks() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status) {
				var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
				var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = '#0095DD';
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function drawScore() {
	ctx.font = '16px Arial';
	ctx.fillStyle = '#0095DD';
	ctx.fillText('Score: ' + score, 8, 20);
}

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
	drawBricks();
	drawerBall();
	drawPaddle();
	drawScore();
	bricksCollision();

	// 因為碰撞偵測位於球的中心，因此得減掉半徑
	if (y + dy < ballRadius) {
		dy = -dy;
	} else if (y + dy > canvas.height - ballRadius) {
		// 碰到 paddleX要反彈
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			//alert('game over');
			//document.location.reload();
		}
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
