'use strict';

class Bg {
    constructor(game = new Game()) {
        this.game = game;
        this.image = this.random = null;
        this.loaded = false;
        this.x = 0;
    }

    init() {
        this.random = Math.floor(Math.random() * 2);
        this.loadImage();
    }

    loadImage() {
        this.image = new Image();
        this.image.onload = () => {
            this.loaded = true;
        };
        this.image.src = (this.random === 0) ? "img/bg-day.png" : "img/bg-night.png";
    }

    update() {
        const currentState = this.game.currentState;
        const state = this.game.state;

        if (currentState === state.over) {
            return;
        } else if (currentState === state.play) {
            this.x--;
            (this.x === -288) && (this.x = 0);
        }
    }

    draw() {
        if (!this.loaded) {
            return;
        }

        this.game.context.drawImage(this.image, this.x, 0);
        this.game.context.drawImage(this.image, this.x + 288, 0);
    }
}