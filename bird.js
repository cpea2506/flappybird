'use strict';

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const restarImg = document.getElementById("restart");
const scoreImg = document.getElementById("score");

// get pipe image
const pipe_180Img = document.getElementById("pipe_180");
const pipeImg = document.getElementById("pipe");

// ger background image
const groundImg = document.getElementById("ground");
const cityImg = document.getElementById("city");
const beachImg = document.getElementById("beach");
const marioImg = document.getElementById("mario");
const forestImg = document.getElementById("forest");

//get bird image
const upRedBirdImg = document.getElementById("upRedBird");
const midRedBirdImg = document.getElementById("midRedBird");
const downRedBirdImg = document.getElementById("downRedBird");
const upBlueBirdImg = document.getElementById("upBlueBird");
const midBlueBirdImg = document.getElementById("midBlueBird");
const downBlueBirdImg = document.getElementById("downBlueBird");
const upYellowBirdImg = document.getElementById("upYellowBird");
const midYellowBirdImg = document.getElementById("midYellowBird");
const downYellowBirdImg = document.getElementById("downYellowBird");

// get number image
const num0Img = document.getElementById("0");
const num1Img = document.getElementById("1");
const num2Img = document.getElementById("2");
const num3Img = document.getElementById("3");
const num4Img = document.getElementById("4");
const num5Img = document.getElementById("5");
const num6Img = document.getElementById("6");
const num7Img = document.getElementById("7");
const num8Img = document.getElementById("8");
const num9Img = document.getElementById("9");
const gameOverImg = document.getElementById("gameOver");
const messageImg = document.getElementById("message");

//get audio
const hitAudio = document.getElementById("hit");
const pointAudio = document.getElementById("point");
const swooshAudio = document.getElementById("swoosh");
const wingAudio = document.getElementById("wing");
const dieAudio = document.getElementById("die");
const nguAudio = document.getElementById("ngu");
const themeAudio = document.getElementById("theme");

// object
let bird;
let pipe;
let head;
let moveBird;
let score;
let speed;
let pipeNum;
let randomBird;
let randomBgr;


function start() {
    speed = 2.5;
    score = 0;
    moveBird = "stop";
    pipeNum = 2000;
    randomBird = Math.floor(Math.random() * 3 + 1);
    randomBgr = Math.floor(Math.random() * 4 + 1);
    createPipe();
    createBird();
}
start();

function createBird() {
    bird = [];
    bird.push({
        x: 100.0,
        y: (height / 2) * 10 * 0.1
    });
}

function createPipe() {
    pipe = [];
    let distance = width;
    let length;
    for (let i = 0; i < pipeNum; i++) {
        if (i % 2 == 0) {
            pipe.push({
                x: distance,
                y: -290,
                w: 50,
                h: length = Math.floor(Math.random() * 130 + 310)
            })
        } else {
            length -= 290;
            pipe.push({
                x: distance,
                y: length += 70,
                w: 50,
                h: height
            });
            distance = Math.floor(Math.random() * 91 + (distance + 126));
        }
    }
}

function draw() {

    themeAudio.play();
    // draw bird
    head = {
        x: bird[0].x,
        y: bird[0].y,
        w: 30,
        h: 20
    };

    if (moveBird == "stop") {
        switch (randomBgr) {
            case 1:
                context.drawImage(beachImg, 0, 0, 600, 300);
                break;
            case 2:
                context.drawImage(cityImg, 0, 0, 600, 300);
                break;
            case 3:
                context.drawImage(marioImg, 0, 0, 600, 300);
                break;
            case 4:
                context.drawImage(forestImg, 0, 0, 600, 300);
                break;
        }

        context.drawImage(messageImg, 47, height / 2 - 80, 138, 159);
        switch (randomBird) {
            case 1:
                context.drawImage(midRedBirdImg, 100, height / 2 + 15, head.w, head.h);
                break;
            case 2:
                context.drawImage(midBlueBirdImg, 100, height / 2 + 15, head.w, head.h);
                break;
            case 3:
                context.drawImage(midYellowBirdImg, 100, height / 2 + 15, head.w, head.h);
                break;
        }

        context.drawImage(groundImg, 0, 250, width, 64);

    } else {
        // draw background
        switch (randomBgr) {
            case 1:
                context.drawImage(beachImg, 0, 0, 600, 300);
                break;

            case 2:
                context.drawImage(cityImg, 0, 0, 600, 300);
                break;
            case 3:
                context.drawImage(marioImg, 0, 0, 600, 300);
                break;
            case 4:
                context.drawImage(forestImg, 0, 0, 600, 300);
                break;
        }

        //draw and move pipe
        for (let i = 0; i < pipe.length; i++) {
            //nếu là số lẻ thì vẽ cột dưới, chẵn thì vẽ cột trên
            if (i % 2 == 0) {
                context.drawImage(pipe_180Img, pipe[i].x -= speed, pipe[i].y, pipe[i].w, pipe[i].h);
            } else {
                context.drawImage(pipeImg, pipe[i].x -= speed, pipe[i].y, pipe[i].w, pipe[i].h);
            }
        }

        // draw the ground to hide the bottom pipe
        context.drawImage(groundImg, 0, 250, width, 64);

        // random color of bird every game
        switch (randomBird) {
            case 1:
                if (moveBird == "down") {
                    context.drawImage(downRedBirdImg, head.x, head.y, head.w, head.h);
                } else if (moveBird == "up") {
                    context.drawImage(upRedBirdImg, head.x, head.y, head.w, head.h);
                } else {
                    context.drawImage(midRedBirdImg, head.x, head.y, head.w, head.h);
                }
                break;
            case 2:
                if (moveBird == "down") {
                    context.drawImage(downBlueBirdImg, head.x, head.y, head.w, head.h);
                } else if (moveBird == "up") {
                    context.drawImage(upBlueBirdImg, head.x, head.y, head.w, head.h);
                } else {
                    context.drawImage(midBlueBirdImg, head.x, head.y, head.w, head.h);
                }
                break;
            case 3:
                if (moveBird == "down") {
                    context.drawImage(downYellowBirdImg, head.x, head.y, head.w, head.h);
                } else if (moveBird == "up") {
                    context.drawImage(upYellowBirdImg, head.x, head.y, head.w, head.h);
                } else {
                    context.drawImage(midYellowBirdImg, head.x, head.y, head.w, head.h);
                }
                break;
        }

        move();
        drawBird();
        death();
        scoreShow();
        pipeScore();
    }
}

function drawBird() {
    // vẽ chim, xóa vị trí cũ, thêm vị trí mới.
    bird.pop();

    let newHead = {
        x: head.x,
        y: head.y
    }

    bird.unshift(newHead);
}

// press space to move bird
window.addEventListener("keydown", (e) => {
    if (e.keyCode == 32)
        moveBird = "up";
});
window.addEventListener("keyup", (e) => {
    if (e.keyCode == 32)
        moveBird = "down";
})


function move() {
    switch (moveBird) {
        case "up":
            head.y -= 4;
            swooshAudio.play();
            break;
        case "down":
            head.y += 3.5;
            wingAudio.play();
            break;
    }
}

function pipeScore() {
    for (let i = 0; i < pipe.length; i += 2) {
        if (head.x > pipe[i].x + pipe[i].w && pipe[i].x > 47) {
            score++;
            pointAudio.play();
        }
    }
    for (let i = 0; i <= score; i += 5) {
        if (score % 5) speed += 0.1;
    }
}

function death() {
    if (head.y > 234) {
        hitAudio.play();
        themeAudio.pause();
        showGameOver();
        cancelAnimationFrame(request);
        return;
    }
    for (let i = 0; i < pipe.length; i++) {
        if (i % 2 == 0) {
            if (pipe[i].x > 0 && head.x + head.w > pipe[i].x && head.x < pipe[i].x + pipe[i].w - 1 && head.y < pipe[i].y + pipe[i].h - 5) {
                hitAudio.play();
                themeAudio.pause();
                showGameOver();
                cancelAnimationFrame(request);
                return;
            }
        } else {
            if (pipe[i].x > 0 && head.x + head.w > pipe[i].x && head.x < pipe[i].x + pipe[i].w - 1 && head.y + head.h > pipe[i].y + 4) {
                hitAudio.play();
                themeAudio.pause();
                showGameOver();
                cancelAnimationFrame(request);
                return;
            }
        }
    }
}

function showGameOver() {
    context.drawImage(gameOverImg, width / 2 - 100, height / 2, 192, 42);
}

function scoreShow() {
    let number = [num0Img, num1Img, num2Img, num3Img, num4Img, num5Img, num6Img, num7Img, num8Img, num9Img];

    if (score < 10) {
        context.drawImage(num0Img, width / 2 - 15, 0, 14, 24);
        for (let i = 0; i < 10; i++) {
            if (score == i) {
                context.drawImage(number[i], width / 2, 0, 14, 24);
            }
        }
    } else if (score > 9) {
        for (let i = 0; i < 10; i++) {
            if (score / 10 >> 0 == i) {
                context.drawImage(number[i], width / 2 - 15, 0, 14, 24);
            }
            for (let j = 0; j < 10; j++) {
                if (score % 10 == i) {
                    context.drawImage(number[i], width / 2, 0, 14, 24);
                }
            }
        }
    }
    // this place is for more than 100 score.
}

let request
const performAnimation = () => {
    request = requestAnimationFrame(performAnimation);
    draw();
}
requestAnimationFrame(performAnimation);


//get canvas coordiantes
// function getMousePos(canvas, event) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//         x: event.clientX - rect.left,
//         y: event.clientY - rect.top
//     };
// }
