import { generateRandomNumber } from "./modules/randomValue.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
// ctx.font = "40px Calibri";
//Set Canvas width and height
canvas.width = 550;
canvas.height = 330;

//Object denoting if the key press happen or not
const keys = {
    up: {
        pressed: false
    },
    down: {
        pressed: false
    }
};


//constructor function to create paddle objects
function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.score = 0;
    this.draw = function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#fff";
        ctx.fill();
    }
    this.update = function () {

        //Handle Key Presses for Human Paddle
        if (keys.up.pressed) {
            this.y -= 5;
        } else if (keys.down.pressed) {
            this.y += 5;
        }

        //Collission detection
        if (ball.x + ball.width >= this.x && ball.x <= this.x + this.width) {
            if (ball.x < this.x + this.width - 3 && ball.x > this.x) {
                ball.x = 0;
            }

            //Increas Ball Speed if it hits the paddle
            if (ball.y + ball.height >= this.y && ball.y <= this.y + this.height) {
                if (ball.dy < 0)
                    ball.dy--;
                else
                    ball.dy++;
                ball.dx *= -1;
            }
        }

        //Checks to keep paddle inside screen
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
        }
        this.draw();
    }
}

Paddle.prototype.updateAiPaddle = function (ball) {

    // Collision detection for AI paddle
    if (ball.x + ball.width >= this.x && ball.x <= this.x + this.width) {
        if (ball.x + ball.width > this.x + 4 && ball.x + ball.width < this.x + this.width) {
            ball.x = canvas.width;
        }

        //Increas Ball Speed if it hits the paddle
        if (ball.y + ball.height >= this.y && ball.y <= this.y + this.height) {
            if (ball.dy < 0)
                ball.dy--;
            else
                ball.dy++;
            ball.dx *= -1;
        }
    }

    let paddleSpeed = 5;

    //If the ball is far away, center the paddle.
    let midPointY = canvas.height / 2;
    let midPointX = canvas.width / 2;

    if ((this.y + (this.height / 2) > midPointY) && ball.x + ball.width < midPointX) {
        this.y -= paddleSpeed;
    } else if ((this.y + (this.height / 2) < midPointY) && ball.x + ball.width < midPointX) {
        this.y += paddleSpeed;
    } else {
        if (ball.x > midPointX && ball.y < this.y) {
            this.y -= paddleSpeed;
        } else if (ball.x > midPointX && ball.y > this.y) {
            this.y += paddleSpeed;
        }
        
    }

    //Checks to keep paddle inside screen
    if (this.y < 0) {
        this.y = 0;
    } else if (this.y + this.height > canvas.height) {
        this.y = canvas.height - this.height;
    }
    this.draw();


}
//constructor function to create Ball object
function Ball(x, y, width, height, dx, dy) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
    this.draw = function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#fff";
        ctx.fill();
    }
    this.update = function () {
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
            if (this.x <= 0) {
                rightPaddle.score++;
            } else {
                leftPaddle.score++;
            }
            this.x = canvas.width / 2 + (this.width / 2) - 10;
            this.y = canvas.height / 2 + (this.width / 2);
            this.dx = 0;
            this.dy = 0;
            round++;
            setTimeout(() => {
                this.dx = generateRandomNumber(2, 0) == 1 ? -3 : 3;
                this.dy = generateRandomNumber(2, 0) == 1 ? -3 : 3;
            }, 2000);
        }
        if (this.y <= 0 || this.y + this.height >= canvas.height) {
            this.dy *= -1;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}
//Paddle Specific Properties
let paddleWidth = 10;
let paddleHeight = 80; //80
let paddleX = 0;
let paddleY = canvas.height / 2 - (paddleHeight / 2);

//Ball Specific Properties
let ballHeight = 10;
let ballWidth = ballHeight;
let ballX = canvas.width / 2 - (ballWidth / 2);
let ballY = canvas.height / 2 + (ballHeight / 2);
let dx = generateRandomNumber(2, 0) === 1 ? -3 : 3;
let dy = generateRandomNumber(2, 0) === 1 ? -3 : 3;

console.log("BallX: " + ballX);
console.log("BallY: " + ballY);

//Instantiate paddle and ball obj
let leftPaddle = new Paddle(paddleX, paddleY, paddleWidth, paddleHeight);
let rightPaddle = new Paddle(canvas.width - paddleWidth, paddleY, paddleWidth, paddleHeight);
let ball = new Ball(ballX, ballY, ballWidth, ballHeight, dx, dy);
console.log("Left Paddle: " + (leftPaddle.x + leftPaddle.width));

document.addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "ArrowUp":
            keys.up.pressed = true;
            break;
        case "ArrowDown":
            keys.down.pressed = true;
            break;
    }
});
document.addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "ArrowUp":
            keys.up.pressed = false;
            break;
        case "ArrowDown":
            keys.down.pressed = false;
            break;
    }
});

let round = 1;
leftPaddle.update();
rightPaddle.updateAiPaddle(ball);
ctx.font = "bold 12px Verdana";
ctx.fillStyle = "#fff";
ctx.fillText(`Round ${round}`, canvas.width / 2 - 23, 20);
ctx.font = "bold 35px Verdana";
ctx.fillText(`${leftPaddle.score}`, (canvas.width / 2) / 2 - 25, 60);
ctx.fillText(`${rightPaddle.score}`, (canvas.width / 2) + (canvas.width / 2) / 2, 60);
ctx.font = "22px Poppins";
ctx.fillText(`Right click mouse to begin`, 160, 180);

for (let i = 0; i < 31; i++) {
    if (i >= 14 && i <= 16)
        continue;
    ctx.beginPath();
    ctx.fillRect(canvas.width / 2 - 4, 25 + (i * 10), 7, 5)
    ctx.fill();
}
let gameStarted = false;
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    leftPaddle.update();
    rightPaddle.updateAiPaddle(ball);
    ball.update();
    ctx.font = "bold 12px Verdana";
    ctx.fillStyle = "#fff";
    if(round == 3){
    ctx.fillText(`Final Round`, canvas.width / 2 - 40, 20);
    }else
        ctx.fillText(`Round ${round}`, canvas.width / 2 - 23, 20);
    ctx.font = "bold 35px Verdana"
    ctx.fillText(`${leftPaddle.score}`, (canvas.width / 2) / 2 - 25, 60);
    ctx.fillText(`${rightPaddle.score}`, (canvas.width / 2) + (canvas.width / 2) / 2, 60);
    ctx.font = "bold 41px sans-serif";
    ctx.fillStyle = "#ff0000";
    if (round == 4) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 41px sans-serif";
        if (leftPaddle.score > rightPaddle.score) {
            ctx.fillStyle = "#00ff00";
            ctx.fillText("You Won -> 🏆", canvas.width / 2 - 130, canvas.height / 2);
        } else {
            ctx.fillStyle = "#ff0000";
            ctx.fillText("You Lost!!!😭😭", canvas.width / 2 - 140, canvas.height / 2);
        }
        window.cancelAnimationFrame(null);
    }
    requestAnimationFrame(render);
}
window.addEventListener("mousedown", () => {
    if (!gameStarted) {
        gameStarted = true;
        render();
    }
})