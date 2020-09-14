'use strict';

class Announce {
    constructor(game = new Game()) {
        this.game = game;
        this.messImg = [];
        this.img1Loaded = this.img2Loaded = this.img3Loaded = this.img4Loaded = false;
        this.img5Loaded = this.img6Loaded = this.img7Loaded = this.img8Loaded = this.img9Loaded = false;

        this.audios = [];
        this.audioLoaded = false;
        this.played = false;

        this.medalImg = [];
        this.medalIndex = 0;

        this.speedY = 0;
        this.gravity = 0.5;

        this.table = {
            x: 30,
            y: 512,
            speedY: 0,
            gravity: 0.05,
        };
        this.tableDone = false;

        this.mess = {
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
        this.medalDone = false;

        // for gameover image
        this.bound = true;

        this.restartBtn = {
            x: 93,
            y: 285,
            w: 100,
            h: 40,
        };

        this.restartDone = false;
    }

    init() {
        this.loadImage();
        this.loadAudio();
    }

    loadImage() {
        const img1 = new Image();
        const img2 = new Image();
        const img3 = new Image();
        const img4 = new Image();
        const img5 = new Image();
        const img6 = new Image();
        const img7 = new Image();
        const img8 = new Image();
        const img9 = new Image();

        img1.onload = () => {
            this.img1Loaded = true;
        };
        img2.onload = () => {
            this.img2Loaded = true;
        };
        img3.onload = () => {
            this.img3Loaded = true;
        };
        img4.onload = () => {
            this.img3Loaded = true;
        };
        img5.onload = () => {
            this.img3Loaded = true;
        };
        img6.onload = () => {
            this.img6Loaded = true;
        };
        img7.onload = () => {
            this.img7Loaded = true;
        };
        img8.onload = () => {
            this.img8Loaded = true;
        };
        img9.onload = () => {
            this.img9Loaded = true;
        };

        img1.src = "img/message.webp";
        img2.src = "img/game-over.webp";
        img3.src = "img/score.webp";
        img4.src = "img/restart.webp";
        this.messImg.push(img1, img2, img3, img4);

        //medal
        img5.src = "img/ngu-medal.webp";
        img6.src = "img/bronze-medal.webp";
        img7.src = "img/silver-medal.webp";
        img8.src = "img/gold-medal.webp";
        img9.src = "img/platinum-medal.webp";
        this.medalImg.push(img5, img6, img7, img8, img9);
    }

    loadAudio() {
        const audio1 = new Audio("audio/hit.wav");
        const audio2 = new Audio("audio/ding.wav");
        this.audios.push(audio1, audio2);
    }

    update() {
        const currentState = this.game.currentState;
        const state = this.game.state;

        if (currentState === state.over) {
            // score table
            this.table.y -= (this.table.speedY += this.table.gravity);
            if (this.table.y < 160) {
                this.tableDone = true;
                this.table.y = 160;
            }

            // game over
            this.mess.y += (this.mess.speedY += this.mess.gravity);
            if (this.mess.y > 100) {
                if (this.bound) {
                    this.mess.speedY *= -0.8;
                    this.bound = false;
                } else {
                    this.mess.y = 100;
                }
            }

            // medal
            if (this.tableDone) {
                this.medalType();
                this.medal.h -= (this.medal.speed += this.medal.acceleration);
                this.medal.w -= (this.medal.speed += this.medal.acceleration);
                if (this.medal.h < 43 && this.medal.w < 43) {
                    this.medalDone = true;
                    this.medal.h = 43;
                    this.medal.w = 43;
                    if (!this.played && this.medalDone) {
                        this.audios[1].play();
                        this.played = true;
                    }
                }
            }
        }
    }

    medalType() {
        const value = this.game.score.point.value;
        this.medalIndex = (value < 10) ? 0 : (value >= 10 && value < 20) ? 1 : (value >= 20 && value < 30) ? 2 : (value >= 30 && value < 40) ? 3 : 4;
    }

    draw() {
        if (!this.img1Loaded || !this.img2Loaded || !this.img3Loaded) {
            return;
        }

        const currentState = this.game.currentState;
        const state = this.game.state;
        const offContext = this.game.offContext;

        if (currentState === state.ready) {
            offContext.drawImage(this.messImg[0], 50, 49);
        } else if (currentState === state.over) {
            offContext.drawImage(this.messImg[1], this.mess.x, this.mess.y);
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