'use strict';

class Pipe {
    constructor(game = new Game()) {
        this.game = game;
        this.pipeImg = this.random = null;
        this.pipes = [];
        this.pipes[0] = {
            x: 500,
            y: Math.floor(Math.random() * 241 + 120),
            w: 52,
            gap: 85
        };
    }

    init() {
        this.random = Math.floor(Math.random() * 2);
        this.loadImage();
    }

    loadImage() {
        this.pipeImg = new Image();

        // random pipes
        switch (this.random) {
            case 0:
                this.pipeImg.src = "img/pipe-green.webp";
                break;
            case 1:
                this.pipeImg.src = "img/pipe-red.webp";
                break;
        }
    }

    update() {
        const currentState = this.game.currentState;
        const state = this.game.state

        if (currentState === state.play) {
            this.pipes.forEach((pipe) => {
                pipe.x--;
                if (pipe.x === 130) {
                    this.pipes.push({
                        x: this.game.width,
                        y: Math.floor(Math.random() * 241 + 120),
                        w: 52,
                        gap: 85
                    });
                }

                if (pipe.x + pipe.w === 0) {
                    this.pipes.shift();
                }
            });
        }
    }

    draw() {
        const offContext = this.game.offContext;
        const width = this.game.width;
        const height = this.game.height;

        this.pipes.forEach((pipe) => {
            // top pipe
            offContext.drawImage(this.pipeImg, pipe.x, pipe.y);

            // bottom pipe
            offContext.save();

            // change coordinate of origin
            offContext.translate(width / 2, height / 2);

            offContext.rotate(Math.PI); // rotate 180
            offContext.scale(-1, 1); // flip image
            offContext.drawImage(
                this.pipeImg,
                pipe.x - width / 2, -height / 2 + 512 - pipe.y + pipe.gap);
            offContext.restore();
        });
    }
}