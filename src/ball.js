var canvas = document.getElementById('ball_canvas');
var ctx = canvas.getContext('2d');

var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 10;

// 重力因子
var dx = 2;
var dy = -2;

// 道具位置
var toolX = canvas.width - getRandomInt(350);
var toolY = -20;
var toolRadius = 15;
var toolDy = 2;
var probability = 0; // 道具出現機率
var isToolShow = false; // 道具是否以顯示, 例如：被吃或者是到最底部

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
var lives = 3;
var isAddSpeed = false; //是否加速 ,  true 已開 , false 未開
var totalBricks = brickRowCount * brickColumnCount; // 總磚頭數
var addSpeedCondition = 5; // 要加速的條件

document.addEventListener('keydown', keydownHandler, false);
document.addEventListener('keyup', keyupHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (var r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}

// 磚塊碰撞偵測
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
					totalBricks -= 1;

					if (totalBricks <= addSpeedCondition) {
						//未開所以要加速
						if (!isAddSpeed) {
							dx = dx * 2;
							dy = dy * 2;
						}

						isAddSpeed = true;
					}

					if (score == brickColumnCount * brickRowCount) {
						alert('YOU WIN!');
						document.location.reload();
					}
				}
			}
		}
	}
}

// 工具碰撞偵測
function toolCollision() {
	// 墜到底部時，參數要重置
	if (toolY + toolDy > canvas.height) {
		toolY = -20;
		isToolShow = false;
		console.log('collision bottom');
	}

	// 工具降落到底部，且又再paddle之間
	if (toolX > paddleX && toolX < paddleWidth + paddleX && toolY + toolRadius >= canvas.height) {
		toolY = -20;
		paddleWidth += 50;
		isToolShow = false;
		console.log('collision paddle');
	}

	if (!isToolShow) {
		toolX = canvas.width - getRandomInt(350);
	}
}

function drawLives() {
	ctx.font = '16px Arial';
	ctx.fillStyle = '#0095DD';
	ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
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

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
	ctx.fillStyle = 'blue';
	ctx.fill();
	ctx.closePath();
}

// 繪製道具
function drawTool() {
	ctx.beginPath();
	// step1 : 繪製回行外框
	ctx.arc(toolX, toolY, toolRadius, 0, Math.PI * 2, false);
	ctx.fillStyle = 'blue';
	ctx.fill();

	// step2 : 繪製十字
	ctx.fillStyle = 'white';
	//橫條
	ctx.fillRect(toolX - toolRadius + 5, toolY - 5, 20, 5);
	// 直條
	ctx.fillRect(toolX - 2, toolY - toolRadius + 4, 5, 20);
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

// ref: https://blog.csdn.net/xf616510229/article/details/54427637
function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;

	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function draw() {
	if (isAddSpeed) {
		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.fillRect(0, 0, canvas.width, canvas.height); // 產生殘影
	} else {
		ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除之前所繪製的圖案
	}

	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();

	// 概率大於6且工具球未出現的話，工具球就要出現
	if (probability >= 6 && !isToolShow) {
		isToolShow = true;
	}
	if (isToolShow) {
		drawTool();
		toolCollision();
	}

	bricksCollision();

	// 因為碰撞偵測位於球的中心，因此得減掉半徑
	if (y + dy < ballRadius) {
		dy = -dy;
	} else if (y + dy > canvas.height - ballRadius) {
		// 碰到底部的時候

		if (x > paddleX && x < paddleX + paddleWidth) {
			// 碰到 paddleX要反彈
			dy = -dy;
		} else {
			lives--;
			if (lives <= 0) {
				alert('Game Over');
				document.location.reload();
			} else {
				x = canvas.width / getRandomInt(5);
				y = canvas.height - getRandomInt(50);

				dx = 2;
				dy = -2;

				paddleX = (canvas.width - paddleWidth) / 2;
			}
		}
	}

	// 超出邊界要反彈
	if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
		dx = -dx;
	}

	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	}

	if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}

	// 工具有顯示的話才要減
	if (isToolShow) {
		toolY += toolDy; // 使工具向下
	}

	x += dx;

	y += dy;

	requestAnimationFrame(draw);
}

setInterval(function() {
	probability = getRandomInt(10);
}, 2000);

draw();
