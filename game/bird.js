'use strict';

class Bird {
    constructor(game = new Game()) {
        this.game = game;
        this.images = [];
        this.audios = [];
        this.img1Loaded = this.img2Loaded = this.img3Loaded = false;
        this.played = new Array(5).fill(false);
        this.random = null;

        // it's time to flap !!!!
        this.currentFrame = this.imageIndex = 0;

        // coordinate
        this.birds = {
            x: 70,
            y: 218,
            w: 34,
            h: 24
        };

        this.toTheHeaven = 376;
        this.heavenDone = false;

        this.jump = this.speedY = 0;
        this.gravity = 0.1;

        // rotate stuff
        this.rotation = 0;
        this.degree = Math.PI / 180;
    }

    init() {
        this.random = Math.floor(Math.random() * 3);
        this.loadAudio();
        this.loadImage();
    }

    loadAudio() {
        const audio1 = new Audio("audio/swoosh.wav");
        const audio2 = new Audio("audio/wing.wav");
        const audio3 = new Audio("audio/hit.wav");
        const audio4 = new Audio("audio/die.wav");
        const audio5 = new Audio("audio/toTheHeaven.mp3");

        this.audios.push(audio1, audio2, audio3, audio4, audio5);
    }

    loadImage() {
        const img1 = new Image();
        const img2 = new Image();
        const img3 = new Image();
        const img4 = new Image();

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
            this.img4Loaded = true;
        };

        //  random birds
        img1.src = (this.random === 0) ? "img/yellowbird-midflap.webp" : (this.random === 1) ? "img/redbird-midflap.webp" : "img/bluebird-midflap.webp";
        img2.src = (this.random === 0) ? "img/yellowbird-downflap.webp" : (this.random === 1) ? "img/redbird-downflap.webp" : "img/bluebird-downflap.webp";
        img3.src = (this.random === 0) ? "img/yellowbird-upflap.webp" : (this.random === 1) ? "img/redbird-upflap.webp" : "img/bluebird-upflap.webp";
        img4.src = "img/deathBird.webp";

        this.images.push(img1, img2, img3, img4);
    }

    update() {
        if (!this.img1Loaded || !this.img2Loaded || !this.img3Loaded) {
            return;
        }

        const state = this.game.state;
        const currentState = this.game.currentState;

        // flap
        this.currentFrame++;
        (this.currentFrame % 5 === 0) && this.changeImage();

        // move bird
        if (currentState !== state.ready) {
            if (this.birds.y <= 375) {
                this.birds.y += (this.speedY += this.gravity);
            }

            if (this.speedY >= this.jump) {
                this.rotation = 90 * this.degree;
                (!this.played[0]) && this.audios[0].play();
            } else {
                this.rotation = -25 * this.degree;
            }
        }

        //check game over
        this.death();
    }

    flap() {
        const currentState = this.game.currentState;
        const state = this.game.state;

        if (currentState === state.over) {
            return;
        }


        if (currentState === state.ready) {
            this.game.currentState = this.game.state.play;
        }

        (!this.played[1]) && this.audios[1].play();

        this.jump = 3;
        this.speedY = -this.jump;
    }

    changeImage() {
        const currentState = this.game.currentState;
        const state = this.game.state;

        if (currentState === state.over) {
            return;
        }


        if (currentState === state.play) {
            (this.imageIndex === 2) ? this.imageIndex = 0: this.imageIndex++;
        }
    }

    death() {
        const pipes = this.game.pipe.pipes;

        // check hit ground
        if (this.birds.y + this.birds.w > 375) {
            this.game.currentState = this.game.state.over;
            if (!this.played[3]) {
                this.audios[3].play();
                this.played[3] = true;
            }
        }
        this.played[0] = true; // stop swooshing

        for (let i = 0; i < pipes.length; i++) {
            // check hit pipe
            if (this.birds.x + this.birds.w > pipes[i].x &&
                this.birds.x < pipes[i].x + pipes[i].w &&
                (this.birds.y + this.birds.h > pipes[i].y ||
                    this.birds.y < pipes[i].y - pipes[i].gap)) {
                if (!this.played[2]) {
                    this.audios[2].play();
                    this.played[2] = true;
                }
                this.game.currentState = this.game.state.over;
                break;
            }
        }
    }

    draw() {
        if (!this.img1Loaded || !this.img2Loaded || !this.img3Loaded) {
            return;
        }
        const currentState = this.game.currentState;
        const state = this.game.state;
        const offContext = this.game.offContext;
        const medalDone = this.game.announce.medalDone;

        if (currentState !== state.over) {
            offContext.save();
            offContext.translate(this.birds.x + 17, this.birds.y + 12);
            offContext.rotate(this.rotation);
            offContext.drawImage(this.images[this.imageIndex], -17, -12);
            offContext.restore();
        } else {
            offContext.save();
            offContext.translate(this.birds.x + 17, this.birds.y + 12);
            offContext.rotate(this.rotation);
            offContext.drawImage(this.images[this.imageIndex], -17, -12);
            offContext.restore();

            // goodbye bird
            if (this.birds.y + this.birds.h > 375 && medalDone && !this.heavenDone) {
                if (!this.played[4]) {
                    this.audios[4].play();
                    this.played[4] = true;
                }

                offContext.drawImage(
                    this.images[3],
                    this.birds.x,
                    (this.toTheHeaven -= 0.75)
                );

                if (this.toTheHeaven < -24) {
                    this.toTheHeaven = -24;
                    this.heavenDone = true;
                    this.audios[4].pause();
                }
            }
        }
    }
}