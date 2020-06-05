let pipe = function (game) {
  this.game = game;
  this.image = null;
  this.loaded = false;

  this.pipes = {
    x: 500,
    y: Math.floor(Math.random() * 241 + 120),
  };

  let self = this;

  this.init = function () {
    this.loadImage();
  };

  this.loadImage = function () {
    this.image = new Image();
    this.image.onload = function () {
      self.loaded = true;
      console.log("pipe loaded");
    };

    // random pipes
    switch (this.game.bg.random) {
      case 0:
        this.image.src = "img/pipe-green.png";
        break;
      case 1:
        this.image.src = "img/pipe-red.png";
        break;
    }
  };

  this.update = function () {
    if (this.game.currentState == this.game.state.over) {
      return;
    } else if (this.game.currentState == this.game.state.play) {
      this.pipes.x--;
      if (this.pipes.x < -52) {
        this.pipes.x = 288;
        this.pipes.y = Math.floor(Math.random() * 241 + 120);
      }
    }
  };

  this.draw = function () {
    if (!self.loaded) {
      return;
    }

    // top pipe
    self.game.context.drawImage(self.image, self.pipes.x, self.pipes.y);

    // bottom pipe
    self.game.context.save();

    // change coordinate of origin
    self.game.context.translate(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2
    );

    self.game.context.rotate(Math.PI); // rotate 180
    self.game.context.scale(-1, 1); // flip image
    self.game.context.drawImage(
      self.image,
      self.pipes.x - this.game.canvas.width / 2,
      -this.game.canvas.height / 2 + 512 - self.pipes.y + 85
    );
    self.game.context.restore();
  };
};
