'use strict';

class Game {
    constructor() {
        //canvas stuff 
        this.offCanvas = document.getElementById("off-canvas");
        this.offContext = this.offCanvas.getContext("2d");
        this.width = this.offCanvas.width;
        this.height = this.offCanvas.height;

        //wrap on-cavas to div element
        this.div = document.getElementById("div-canvas");
        this.canvas = document.createElement("canvas");
        this.canvas.width = 288;
        this.canvas.height = 512;
        this.div.appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");
        this.trackingFps = {
            start: 0,
            elapsed: 0,
            now: 0,
            then: 0,
            fps: 0,
            fpsInterval: 0
        }

        // game object 
        this.bg = new Bg(this);
        this.pipe = new Pipe(this);
        this.base = new Base(this);
        this.bird = new Bird(this);
        this.announce = new Announce(this);
        this.score = new Score(this);
        this.state = {
            ready: 0,
            play: 1,
            over: 2
        };

        this.currentState = this.state.ready;

        // audio 
        this.audio = new Audio("audio/theme.mp3");
    }

    init() {
        this.bg.init();
        this.base.init();
        this.bird.init();
        this.pipe.init();
        this.announce.init();
    }

    startAnimating(fps) {
        this.trackingFps.fpsInterval = 1000 / fps;
        this.trackingFps.then = Date.now();
        this.trackingFps.start = this.trackingFps.then;

        this.play();
    }

    play() {
        //request another frame
        const requestId = requestAnimationFrame(this.play.bind(this));

        //calculation elapsed time since the last loop
        this.trackingFps.now = Date.now();
        this.trackingFps.elapsed = this.trackingFps.now - this.trackingFps.then;

        // if enough time has elapsed, draw next frame
        if (this.trackingFps.elapsed > this.trackingFps.fpsInterval) {
            this.trackingFps.then = this.trackingFps.now - (this.trackingFps.elapsed % this.trackingFps.fpsInterval);

            //draw animating objects
            this.update();
            this.draw();
            this.checkLose(requestId);
        }

    }

    checkLose(requestId) {
        if (this.currentState === this.state.over) {
            this.audio.pause();
            if (this.bird.restartDone) {
                cancelAnimationFrame(requestId);
            }
        }
    }

    update() {
        if (this.currentState === this.state.play) {
            this.audio.volume = 0.1;
            this.audio.play();
        }

        // update function
        this.bg.update();
        this.pipe.update();
        this.base.update();
        this.bird.update();
        this.score.update();
        this.announce.update();
    }

    draw() {
        this.bg.draw();
        this.pipe.draw();
        this.announce.draw();
        this.score.draw();
        this.bird.draw();
        this.base.draw();

        // draw the entire off-canvas to on-canvas
        this.context.drawImage(this.offCanvas, 0, 0, this.width, this.height);
    }

    // get mouse's position on canvas
    mousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
        };
    }

    flapEvent() {
        (this.currentState !== this.state.over) && this.bird.flap();
    }
}

window.onload = () => {
    const fps = 60;
    let game = new Game();
    game.init();
    game.startAnimating(fps);

    document.addEventListener("click", (e) => {
        game.flapEvent();
        const mousePos = game.mousePos(game.canvas, e);
        const restartBtn = game.announce.restartBtn;
        if (game.bird.heavenDone) {
            // click restart button
            if (mousePos.x >= restartBtn.x &&
                mousePos.x <= (restartBtn.x + restartBtn.w) &&
                mousePos.y >= restartBtn.y &&
                mousePos.y <= (restartBtn.y + restartBtn.h)) {
                game.div.removeChild(game.canvas);
                game = new Game();
                game.init();
                game.startAnimating(fps);
            }
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === " ") {
            game.flapEvent();
            if (game.bird.heavenDone) {
                game.div.removeChild(game.canvas);
                game = new Game();
                game.init();
                game.startAnimating(fps);
            }
        }
    });
}