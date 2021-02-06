'use strict';

class Bird {
    constructor(game = new Game()) {
        this.game = game;
        this.images = [];

        this.audios = [];

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
        const swooshAu = new Audio("audio/swoosh.wav");
        const wingAu = new Audio("audio/wing.wav");
        const hitAu = new Audio("audio/hit.wav");
        const dieAu = new Audio("audio/die.wav");
        const toTheHeavenAu = new Audio("audio/toTheHeaven.mp3");

        this.audios.push(swooshAu, wingAu, hitAu, dieAu, toTheHeavenAu);
    }

    loadImage() {
        const midFlapImg = new Image();
        const downFlapImg = new Image();
        const upFlapImg = new Image();
        const deathImg = new Image();

        //  random birds
        switch (this.random) {
            case 0:
                // yellow
                midFlapImg.src = "img/yellowbird-midflap.webp";
                downFlapImg.src = "img/yellowbird-downflap.webp";
                upFlapImg.src = "img/yellowbird-upflap.webp";
                break;
            case 1:
                // red
                midFlapImg.src = "img/redbird-midflap.webp";
                downFlapImg.src = "img/redbird-downflap.webp";
                upFlapImg.src = "img/redbird-upflap.webp";
                break;

            case 2:
                // blue
                midFlapImg.src = "img/bluebird-midflap.webp";
                downFlapImg.src = "img/bluebird-downflap.webp";
                upFlapImg.src = "img/bluebird-upflap.webp";
                break;
        }
        deathImg.src = "img/deathBird.webp";

        this.images.push(midFlapImg, downFlapImg, upFlapImg, deathImg);
    }

    update() {
        const state = this.game.state;
        const currentState = this.game.currentState;

        if (currentState !== state.ready) {
            // flap
            this.currentFrame++;
            (currentState === state.play && this.currentFrame % 5 === 0) &&
            (this.imageIndex = (++this.imageIndex) % 3); // change bird's image each frame to see it flaps

            // move bird
            (this.birds.y <= 375) &&
            (this.birds.y += (this.speedY += this.gravity));

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

        (currentState === state.ready) &&
        (this.game.currentState = this.game.state.play);

        this.audios[1].play();

        this.speedY = -(this.jump = 3);
    }


    death() {
        const pipes = this.game.pipe.pipes;

        // check hit ground
        if (this.birds.y + this.birds.w > 375) {
            this.game.currentState = this.game.state.over;
            if (!this.played[3]) {
                this.audios[3].play();
                this.played[3] = true; // stop dying
                this.played[0] = true; // stop swooshing
            }
        }


        for (let i = 0, length = pipes.length; i < length; i++) {
            // check hit pipe
            if (this.birds.x + this.birds.w > pipes[i].x &&
                this.birds.x < pipes[i].x + pipes[i].w &&
                (this.birds.y + this.birds.h > pipes[i].y ||
                    this.birds.y < pipes[i].y - pipes[i].gap)) {
                if (!this.played[2]) {
                    this.audios[2].play();
                    this.played[2] = true; // stop hitting
                    this.played[0] = true; // stop swooshing
                }
                this.game.currentState = this.game.state.over;
                break;
            }
        }
    }

    draw() {
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

                this.toTheHeaven -= 1;
                offContext.drawImage(
                    this.images[3],
                    this.birds.x,
                    this.toTheHeaven
                );

                if (this.toTheHeaven < -24) {
                    this.heavenDone = true;
                    this.audios[4].pause();
                }
            }
        }
    }
}