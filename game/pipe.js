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
        this.image.src = (randomBg === 0) ? "img/pipe-green.png" : "img/pipe-red.png";
    }

    update() {
        const currentState = this.game.currentState;
        const state = this.game.state

        if (currentState === state.over) {
            return;
        } else if (currentState === state.play) {
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

                if (this.pipes[i].x + this.pipes[i].w === 5) {
                    this.pipes.shift();
                }
            });
        }
    }

    draw() {
        if (!this.loaded) {
            return;
        }

        const context = this.game.context;
        const width = this.game.width;
        const height = this.game.height;

        this.pipes.forEach((pipe, i) => {
            // top pipe
            context.drawImage(this.image, this.pipes[i].x, this.pipes[i].y);

            // bottom pipe
            context.save();

            // change coordinate of origin
            context.translate(width / 2, height / 2);

            context.rotate(Math.PI); // rotate 180
            context.scale(-1, 1); // flip image
            context.drawImage(
                this.image,
                this.pipes[i].x - width / 2, -height / 2 + 512 - this.pipes[i].y + this.pipes[i].gap);
            context.restore();
        });
    }
}