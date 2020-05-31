let announce = function (game) {
  this.game = game;
  this.messImg = [];
  this.img1Loaded = false;
  this.img2Loaded = false;
  this.img3Loaded = false;
  this.img4Loaded = false;
  this.img5Loaded = false;
  this.img6Loaded = false;
  this.img7Loaded = false;
  this.img8Loaded = false;
  this.img9Loaded = false;

  this.audios = [];
  this.audioLoaded = false;
  this.played = false;

  this.medalImg = [];
  this.medalIndex = 0;

  this.speedY = 0;
  this.gravity = 0.5;

  let self = this;

  this.table = {
    x: 30,
    y: 512,
    speedY: 0,
    gravity: 0.05,
  };
  this.tableDone = false;

  this.mess = {
    x: 45,
    y: -42,
    speedY: 0,
    gravity: 0.1,
  };

  this.medal = {
    x: 55,
    y: 203,
    w: 420,
    h: 420,
    speed: 0,
    acceleration: 0.15,
  };
  this.medalDone = false;

  // for gameover image
  this.bound = true;

  this.restartBtn = {
    x: 93,
    y: 285,
    w: 100,
    h: 40,
  };

  this.init = function () {
    this.loadImage();
    this.loadAudio();
  };

  this.loadImage = function () {
    let img1 = new Image();
    let img2 = new Image();
    let img3 = new Image();
    let img4 = new Image();
    let img5 = new Image();
    let img6 = new Image();
    let img7 = new Image();
    let img8 = new Image();
    let img9 = new Image();

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
      self.img3Loaded = true;
      console.log("Image4 loaded");
    };
    img5.onload = function () {
      self.img3Loaded = true;
      console.log("Image5 loaded");
    };
    img6.onload = function () {
      self.img6Loaded = true;
      console.log("Image6 loaded");
    };
    img7.onload = function () {
      self.img7Loaded = true;
      console.log("Image7 loaded");
    };
    img8.onload = function () {
      self.img8Loaded = true;
      console.log("Image8 loaded");
    };
    img9.onload = function () {
      self.img9Loaded = true;
      console.log("Image9 loaded");
    };

    img1.src = "img/message.png";
    img2.src = "img/game-over.png";
    img3.src = "img/score.png";
    img4.src = "img/restart.png";
    this.messImg.push(img1, img2, img3, img4);

    //medal
    img5.src = "img/ngu-medal.png";
    img6.src = "img/bronze-medal.png";
    img7.src = "img/silver-medal.png";
    img8.src = "img/gold-medal.png";
    img9.src = "img/platinum-medal.png";
    this.medalImg.push(img5, img6, img7, img8, img9);
  };

  this.loadAudio = function () {
    let audio1 = new Audio("audio/hit.wav");
    let audio2 = new Audio("audio/ding.wav");
    this.audios.push(audio1, audio2);
  };

  this.update = function () {
    if (this.game.currentState == this.game.state.over) {
      // score table
      this.table.speedY += this.table.gravity;
      this.table.y -= this.table.speedY;
      if (this.table.y < 160) {
        this.tableDone = true;
        this.table.y = 160;
      }

      // game over
      this.mess.speedY += this.mess.gravity;
      this.mess.y += this.mess.speedY;
      if (this.mess.y > 100) {
        if (this.bound) {
          this.mess.speedY *= -0.8;
          this.bound = false;
        } else {
          this.mess.y = 100;
        }
      }
      console.log(this.medalIndex);

      // medal
      if (this.tableDone) {
        this.medalType();
        this.medal.speed += this.medal.acceleration;
        this.medal.h -= this.medal.speed;
        this.medal.w -= this.medal.speed;
        if (this.medal.h < 43 && this.medal.w < 43) {
          this.medalDone = true;
          this.medal.h = 43;
          this.medal.w = 43;
          if (!this.played && this.medalDone) {
            this.audios[1].play();
            this.played = true;
          }
        }
      }
    }
  };

  this.medalType = function () {
    if (this.game.score.point.value >= 10 && this.game.score.point.value < 20) {
      this.medalIndex = 1;
    } else if (this.game.score.point.value >= 20 && this.game.score.point.value < 30) {
      this.medalIndex = 2;
    } else if (this.game.score.point.value >= 30 && this.game.score.point.value < 40) {
      this.medalIndex = 3;
    } else if (this.game.score.point.value >= 40) {
      this.medalIndex = 4;
    }
  };

  this.click = function () {
    this.game.canvas.addEventListener;
  };
  this.draw = function () {
    if (!self.img1Loaded || !self.img2Loaded || !self.img3Loaded) {
      return;
    }

    if (this.game.currentState == this.game.state.ready) {
      self.game.context.drawImage(self.messImg[0], 50, 49);
    }

    if (this.game.currentState == this.game.state.over) {
      self.game.context.drawImage(self.messImg[1], this.mess.x, this.mess.y);
      self.game.context.drawImage(self.messImg[2], this.table.x, this.table.y);

      // finish drawing table
      if (this.tableDone) {
        // draw medal
        self.game.context.drawImage(
          this.medalImg[this.medalIndex],
          this.medal.x,
          this.medal.y,
          this.medal.w,
          this.medal.h
        );
      }

      // finishing drawing medal
      if (this.game.bird.heavenDone) {
        // restart button
        self.game.context.drawImage(
          this.messImg[3],
          this.restartBtn.x,
          this.restartBtn.y,
          this.restartBtn.w,
          this.restartBtn.h
        );
      }
    }
  };
};
