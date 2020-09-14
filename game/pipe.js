'use strict';

class Pipe {
    constructor(game = new Game()) {
        this.game = game;
        this.image = null;
        this.loaded = false;
        this.pipes = [];
        this.pipes[0] = {
            x: 500,
            y: Math.floor(Math.random() * 241 + 120),
            w: 52,
            gap: 85
        };
    }

    init() {
        this.loadImage();
    }

    loadImage() {
        this.image = new Image();
        this.image.onload = () => {
            this.loaded = true;
        };

        // random pipes
        const randomBg = this.game.bg.random;
        this.image.src = (randomBg === 0) ? "img/pipe-green.webp" : "img/pipe-red.webp";
    }

    update() {
        const currentState = this.game.currentState;
        const state = this.game.state

        if (currentState === state.play) {
            this.pipes.forEach((pipe, i) => {
                this.pipes[i].x--;
                if (this.pipes[i].x === 130) {
                    this.pipes.push({
                        x: this.game.width,
                        y: Math.floor(Math.random() * 241 + 120),
                        w: 52,
                        gap: 85
                    });
                }

                if (this.pipes[i].x + this.pipes[i].w === 0) {
                    this.pipes.shift();
                }
            });
        }
    }

    draw() {
        if (!this.loaded) {
            return;
        }

        const offContext = this.game.offContext;
        const width = this.game.width;
        const height = this.game.height;
        const currentState = this.game.currentState;
        const state = this.game.state;

        this.pipes.forEach((pipe, i) => {
            // top pipe
            offContext.drawImage(this.image, this.pipes[i].x, this.pipes[i].y);

            // bottom pipe
            offContext.save();

            // change coordinate of origin
            offContext.translate(width / 2, height / 2);

            offContext.rotate(Math.PI); // rotate 180
            offContext.scale(-1, 1); // flip image
            offContext.drawImage(
                this.image,
                this.pipes[i].x - width / 2, -height / 2 + 512 - this.pipes[i].y + this.pipes[i].gap);
            offContext.restore();
        });
    }
}