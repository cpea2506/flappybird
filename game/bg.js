'use strict';

class Bg {
    constructor(game = new Game()) {
        this.game = game;
        this.image = this.random = null;
        this.x = 0;
    }

    init() {
        this.random = Math.floor(Math.random() * 2);
        this.loadImage();
    }

    loadImage() {
        this.image = new Image();

        switch (this.random) {
            case 0:
                this.image.src = "img/bg-day.webp";
                break;
            case 1:
                this.image.src = "img/bg-night.webp";
                break;
        }
    }

    update() {
        const currentState = this.game.currentState;
        const state = this.game.state;

        (currentState === state.play) &&
        (this.x = (--this.x) % 289);
    }

    draw() {
        this.game.offContext.drawImage(this.image, this.x, 0);
        this.game.offContext.drawImage(this.image, this.x + 288, 0);
    }
}