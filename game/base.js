'use strict';

class Base {
    constructor(game = new Game()) {
        this.game = game;
        this.image = null;
        this.x = 0;
    }

    init() {
        this.loadImage();
    }

    loadImage() {
        this.image = new Image();

        this.image.src = "img/base.webp";
    }

    update() {
        const currentState = this.game.currentState;
        const state = this.game.state;

        (currentState === state.play) &&
        (this.x = (--this.x) % 337);

    }

    draw() {
        const offContext = this.game.offContext;
        const height = this.game.height;
        const bird = this.game.bird.birds;
        const medalDone = this.game.announce.medalDone;

        offContext.drawImage(this.image, this.x, height - 112);
        offContext.drawImage(
            this.image,
            this.x + 336,
            height - 112
        );

        if ((bird.y + bird.h) > 376 && medalDone) {
            offContext.fillStyle = "#FFF";
            offContext.strokeStyle = "#000";
            offContext.font = "35px Teko";

            const mess = "PAY F TO RESPECT";
            offContext.fillText(mess, 25, 480);
            offContext.strokeText(mess, 25, 480);
        }
    }
}