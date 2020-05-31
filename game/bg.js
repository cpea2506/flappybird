let bg = function (game) {
  this.game = game;
  this.image = null;
  this.loaded = false;
  this.random = null;
  this.x = 0;
  let self = this;

  this.init = function () {
    this.random = Math.floor(Math.random() * 2);
    this.loadImage();
  };

  this.loadImage = function () {
    this.image = new Image();

    this.image.onload = function () {
      self.loaded = true;
      console.log("Image loaded");
    };

    switch (this.random) {
      case 0:
        // day
        this.image.src = "img/bg-day.png";
        break;
      case 1:
        // night
        this.image.src = "img/bg-night.png";
        break;
    }
  };

  this.update = function () {
    if (this.game.currentState == this.game.state.over) {
      return;
    } else if (this.game.currentState == this.game.state.play) {
      this.x--;
      if (this.x == -288) {
        this.x = 0;
      }
    }
  };

  this.draw = function () {
    if (!self.loaded) {
      return;
    }

    self.game.context.drawImage(self.image, this.x, 0);
    self.game.context.drawImage(self.image, this.x + 288, 0);
  };
};
