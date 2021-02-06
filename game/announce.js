'use strict';

class Announce {
    constructor(game = new Game()) {
        this.game = game;
        this.messImg = [];
        this.medalImg = [];
        this.medalIndex = 0;

        this.dingAu = new Audio("audio/ding.wav");
        this.played = false;

        this.speedY = 0;
        this.gravity = 0.5;

        this.table = {
            x: 30,
            y: 512,
            speedY: 0,
            gravity: 0.05,
        };
        this.over = {
            x: 45,
            y: -42,
            speedY: 0,
            gravity: 0.1,
        };
        this.medal = {
            x: 55,
            y: 203,
            w: 420,
            h: 420,
            speed: 0,
            acceleration: 0.15,
        };
        this.restartBtn = {
            x: 93,
            y: 285,
            w: 100,
            h: 40,
        };

        this.bound = true;
        this.tableDone = false;
        this.overDone = false;
        this.medalDone = false;
        this.restartDone = false;
    }

    init() {
        this.loadImage();
    }

    loadImage() {
        const messImg = new Image();
        const overImg = new Image();
        const scoreImg = new Image();
        const restartImg = new Image();
        const nguImg = new Image();
        const bronzeImg = new Image();
        const silverImg = new Image();
        const goldImg = new Image();
        const platinumImg = new Image();

        messImg.src = "img/message.webp";
        overImg.src = "img/game-over.webp";
        scoreImg.src = "img/score.webp";
        restartImg.src = "img/restart.webp";

        this.messImg.push(messImg, overImg, scoreImg, restartImg);

        //medal
        nguImg.src = "img/ngu-medal.webp";
        bronzeImg.src = "img/bronze-medal.webp";
        silverImg.src = "img/silver-medal.webp";
        goldImg.src = "img/gold-medal.webp";
        platinumImg.src = "img/platinum-medal.webp";

        this.medalImg.push(nguImg, bronzeImg, silverImg, goldImg, platinumImg);
    }

    update() {
        const currentState = this.game.currentState;
        const state = this.game.state;

        if (currentState === state.over) {
            // score table
            if (!this.tableDone) {
                this.table.y -= (this.table.speedY += this.table.gravity);
                if (this.table.y < 160) {
                    this.table.y = 160;
                    this.tableDone = true;
                }
            } else {
                if (!this.medalDone) {
                    this.medalType();
                    this.medal.h -= (this.medal.speed += this.medal.acceleration);
                    this.medal.w -= (this.medal.speed += this.medal.acceleration);
                    if (this.medal.h < 43 && this.medal.w < 43) {
                        this.medal.h = 43;
                        this.medal.w = 43;
                        this.medalDone = true;
                    }
                } else {
                    if (!this.played) {
                        this.dingAu.play();
                        this.played = true;
                    }
                }
            }

            // game over
            if (!this.overDone) {
                this.over.y += (this.over.speedY += this.over.gravity);
                if (this.over.y > 100) {
                    if (this.bound) {
                        this.over.speedY *= -0.8;
                        this.bound = false;
                    } else {
                        this.over.y = 100;
                        this.overDone = true;
                    }
                }
            }
        }
    }

    medalType() {
        const value = this.game.score.point.value;
        if (value < 10) {
            this.medalIndex = 0;
        } else if (value >= 10 && value < 20) {
            this.medalIndex = 1;
        } else if (value >= 20 && value < 30) {
            this.medalIndex = 2;
        } else if (value >= 30 && value < 40) {
            this.medalIndex = 3;
        } else {
            this.medalIndex = 4;
        }
    }

    draw() {
        const currentState = this.game.currentState;
        const state = this.game.state;
        const offContext = this.game.offContext;

        if (currentState === state.ready) {
            offContext.drawImage(this.messImg[0], 50, 49);
        } else if (currentState === state.over) {
            offContext.drawImage(this.messImg[1], this.over.x, this.over.y);
            offContext.drawImage(this.messImg[2], this.table.x, this.table.y);

            // finish drawing table
            (this.tableDone) &&
            offContext.drawImage(
                this.medalImg[this.medalIndex],
                this.medal.x,
                this.medal.y,
                this.medal.w,
                this.medal.h
            );
        }

        // finishing drawing medal
        if (this.game.bird.heavenDone) {
            offContext.drawImage(
                this.messImg[3],
                this.restartBtn.x,
                this.restartBtn.y,
                this.restartBtn.w,
                this.restartBtn.h
            );
            this.restartDone = true;
        }
    }
}