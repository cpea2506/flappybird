let game = function () {
  //canvas stuff
  this.canvas = null;
  this.context = null;
  this.width = 288;
  this.height = 512;

  // game's object
  this.bg = null;
  this.base = null;
  this.bird = null;
  this.pipe = null;
  this.announce = null;
  this.game = null;

  this.state = {
    ready: 0,
    play: 1,
    over: 2,
  };

  this.currentState = this.state.ready;

  let self = this;

  this.init = function () {

    // off screen canvas

    // on screen Canvas
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    document.body.appendChild(this.canvas);

    //create background
    this.bg = new bg(this);
    this.bg.init();

    //create base
    this.base = new base(this);
    this.base.init();

    //create pipe
    this.pipe = new pipe(this);
    this.pipe.init();

    //create bird
    this.bird = new bird(this);
    this.bird.init();

    // create score
    this.score = new score(this);
    this.score.init();

    //create announce
    this.announce = new announce(this);
    this.announce.init();

    this.audio = new Audio("audio/theme.mp3");

    this.currentState = this.state.ready;

    this.clickEvent(); // mouse
    this.keyDownEvent(); // space 

    this.loop();
  };

  // get mouse's position on canvas
  this.mousePos = function (canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  this.clickEvent = function () {
    this.canvas.addEventListener("click", (evt) => {
      if (
        this.currentState == this.state.ready ||
        this.currentState == this.state.play
      ) {
        self.bird.flap();
      } else {
        // click restart button
        if (this.bird.heavenDone) {
          if (
            this.mousePos(this.canvas, evt).x >= this.announce.restartBtn.x &&
            this.mousePos(this.canvas, evt).x <=
              this.announce.restartBtn.x + this.announce.restartBtn.w &&
            this.mousePos(this.canvas, evt).y >= this.announce.restartBtn.y &&
            this.mousePos(this.canvas, evt).y <=
              this.announce.restartBtn.y + this.announce.restartBtn.h
          ) {
            this.canvas.parentNode.removeChild(this.canvas); // remove old canvas
            this.g = new game();
            this.g.init();
          }
        }
      }
    });
  };

  this.keyDownEvent = function() {
    window.addEventListener("keydown", (evt) => {
      if (
        this.currentState == this.state.ready ||
        this.currentState == this.state.play && evt.keyCode == 32 
      ) {
        self.bird.flap();
      }
      else if(this.bird.heavenDone && evt.keyCode == 32) {
        this.canvas.parentNode.removeChild(this.canvas); // remove old canvas
            this.g = new game();
            this.g.init();
      }
    })
  }

  this.loop = function () {
    requestAnimationFrame(self.loop);
    self.update();
    self.draw();
  };

  this.update = function () {
    if (this.currentState == this.state.play) {
      this.audio.volume = 0.2;
      this.audio.play();
    } else this.audio.pause();

    // update function
    this.bg.update();
    this.pipe.update();
    this.base.update();
    this.bird.update();
    this.score.update();
    this.announce.update();
  };

  this.draw = function () {
    this.bg.draw();
    this.pipe.draw();
    this.announce.draw();
    this.score.draw();
    this.bird.draw();
    this.base.draw();
  };
};

let g = new game();
g.init();
