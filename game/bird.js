let bird = function (game) {
  this.game = game;
  this.images = [];
  this.img1Loaded = false;
  this.img2Loaded = false;
  this.img3Loaded = false;

  this.audios = [];
  this.played = [false, false, false, false, false];

  this.random = null;

  // it's time to flap !!!!
  this.currentFrame = 0;
  this.currentImageIndex = 0;
  this.currentImage = null;

  // coordinate
  this.birds = {
    x: 70,
    y: 218,
  };

  this.toTheHeaven = 376;
  this.heavenDone = false;

  this.jump = 0;
  this.speedY = 0;
  this.gravity = 0.1;

  // rotate stuff
  this.rotation = 0;
  this.degree = Math.PI / 180;

  let self = this;

  this.init = function () {
    this.random = this.random = Math.floor(Math.random() * 3);
    this.loadAudio();
    this.loadImage();
  };

  this.loadAudio = function () {
    let audio1 = new Audio("audio/swoosh.wav");
    let audio2 = new Audio("audio/wing.wav");
    let audio3 = new Audio("audio/hit.wav");
    let audio4 = new Audio("audio/die.wav");
    let audio5 = new Audio("audio/toTheHeaven.mp3");

    this.audios.push(audio1, audio2, audio3, audio4, audio5);
  };

  this.loadImage = function () {
    let img1 = new Image();
    let img2 = new Image();
    let img3 = new Image();
    let img4 = new Image();

    this.currentImage = new Image();

    img1.onload = function () {
      self.img1Loaded = true;
      console.log("Image1 loaded");
    };
    img2.onload = function () {
      self.img2Loaded = true;
      console.log("Image2 loaded");
    };
    img3.onload = function () {
      self.img3Loaded = true;
      console.log("Image3 loaded");
    };
    img4.onload = function () {
      self.img4Loaded = true;
      console.log("Image4 loaded");
    };

    //  random birds
    switch (this.random) {
      case 0:
        // yellow
        img1.src = "img/yellowbird-midflap.png";
        img2.src = "img/yellowbird-downflap.png";
        img3.src = "img/yellowbird-upflap.png";
        break;
      case 1:
        // red
        img1.src = "img/redbird-midflap.png";
        img2.src = "img/redbird-downflap.png";
        img3.src = "img/redbird-upflap.png";
        break;
      case 2:
        // blue
        img1.src = "img/bluebird-midflap.png";
        img2.src = "img/bluebird-downflap.png";
        img3.src = "img/bluebird-upflap.png";
        break;
    }

    img4.src = "img/deathBird.png";

    this.images.push(img1, img2, img3, img4);
  };

  this.update = function () {
    if (!this.img1Loaded || !this.img2Loaded || !this.img3Loaded) {
      return;
    }

    // flap
    this.currentFrame++;
    if (this.currentFrame % 10 == 0) {
      this.changeImage();
    }

    // move bird
    if (
      this.game.currentState == this.game.state.play ||
      this.game.currentState == this.game.state.over
    ) {
      if (this.birds.y <= 375) {
        this.speedY += this.gravity;
        this.birds.y += this.speedY;
      }
      if (this.speedY >= this.jump) {
        this.rotation = 180 * this.degree;
        if (!this.played[0]) {
          this.audios[0].play();
        }
      } else {
        this.rotation = -25 * this.degree;
      }
    }

    //check game over
    this.death();
  };

  this.flap = function () {
    if (this.game.currentState == this.game.state.over) {
      return;
    }

    if (!this.played[1]) {
      this.audios[1].play();
    }

    if (this.game.currentState == this.game.state.ready) {
      this.game.currentState = this.game.state.play;
    }

    this.jump = 3;
    this.speedY = -this.jump;
  };

  this.changeImage = function () {
    if (this.game.currentState == this.game.state.over) {
      return;
    }

    if (this.game.currentState == this.game.state.play) {
      if (this.currentImageIndex == 2) {
        this.currentImageIndex = 0;
      } else this.currentImageIndex++;
    }

    this.currentImage = this.images[this.currentImageIndex];
  };

  this.death = function () {
    // check hit ground
    if (this.birds.y + 24 > 375) {
      this.game.currentState = this.game.state.over;
      if (!this.played[3]) {
        this.audios[3].play();
        this.played[3] = true;
      }
      this.played[0] = true; // stop swooshing
    }

    // check hit pipe
    if (
      this.birds.x + 34 > this.game.pipe.pipes.x &&
      this.birds.x < this.game.pipe.pipes.x + 52 &&
      (this.birds.y + 24 > this.game.pipe.pipes.y ||
        this.birds.y < this.game.pipe.pipes.y - 85)
    ) {
      if (!this.played[2]) {
        this.audios[2].play();
        this.played[2] = true;

        self.game.canvas
      }
      this.game.currentState = this.game.state.over;
    }
  };

  this.draw = function () {
    if (!self.img1Loaded || !self.img2Loaded || !self.img3Loaded) {
      return;
    }

    if (this.game.currentState != this.game.state.over) {
      self.game.context.save();
      self.game.context.translate(this.birds.x + 17, this.birds.y + 12);
      self.game.context.rotate(this.rotation);
      self.game.context.drawImage(self.currentImage, -17, -12);
      self.game.context.restore();
    } else {
      self.game.context.save();
      self.game.context.translate(this.birds.x + 17, this.birds.y + 12);
      self.game.context.rotate(this.rotation);
      self.game.context.drawImage(self.currentImage, -17, -12);
      self.game.context.restore();

      // goodbye bird
      if (this.birds.y + 24 > 375 && this.game.announce.medalDone && !this.heavenDone) {
        if (!this.played[4]) {
          this.audios[4].play();
          this.played[4] = true;
        }

        self.game.context.drawImage(
          self.images[3],
          this.birds.x,
          (this.toTheHeaven -= 0.5)
        );
        if(this.toTheHeaven < -24) {
          this.heavenDone = true;
          this.audios[4].pause();
        }
      }
    }
  };
};
