let base = function (game) {
  this.game = game;
  this.image = null;
  this.loaded = false;
  this.x = 0;

  let self = this;

  this.init = function () {
    this.loadImage();
  };

  this.loadImage = function () {
    this.image = new Image();
    this.image.onload = function () {
      self.loaded = true;
      console.log("Image loaded");
    };
    this.image.src = "img/base.png";
  };

  this.update = function () {
    if (this.game.currentState == this.game.state.over) {
      return;
    } else if (this.game.currentState == this.game.state.play) {
      this.x--;
      if (this.x == -336) {
        this.x = 0;
      }
    }
  };

  this.draw = function () {
    if (!self.loaded) {
      return;
    }
    self.game.context.drawImage(self.image, this.x, self.game.height - 112);
    self.game.context.drawImage(
      self.image,
      this.x + 336,
      self.game.height - 112
    );

    if (this.game.bird.birds.y + 24 > 376 && this.game.announce.medalDone) {
      self.game.context.fillStyle = "#FFF";
      self.game.context.strokeStyle = "#000";
      self.game.context.font = "35px Teko";
      let mess = "PAY F TO RESPECT";
      self.game.context.fillText(
        mess,
        25,
        480
      );
      self.game.context.strokeText(
        mess,
        25,
        480
      );
    }
  };
};
