let score = function (game) {
  this.game = game;
  this.point = {
    value: 0,
    best: parseInt(localStorage.getItem("best")) || 0, // get item local storage
  };

  this.imageIndex = 0;
  this.audio = null;

  let self = this;

  this.init = function () {
    this.audio = new Audio("audio/score.wav");
  };

  this.update = function () {
    if (
      this.game.pipe.pipes.x + 52 > this.game.bird.birds.x - 2 &&
      this.game.bird.birds.x > this.game.pipe.pipes.x + 52
    ) {
      this.audio.play();
      this.point.value++;
      this.point.best = Math.max(this.point.value, this.point.best);
      localStorage.setItem("best", this.point.best); // save to local storage
    }
  };

  this.draw = function () {
    self.game.context.fillStyle = "#FFF";
    self.game.context.strokeStyle = "#000";
    self.game.context.lineWidth = 2;
    if (this.game.currentState == this.game.state.play) {
      self.game.context.font = "50px Teko";

      self.game.context.fillText(this.point.value, this.game.canvas.width / 2 - 15, 50);
      self.game.context.strokeText(this.point.value, this.game.canvas.width / 2 - 15, 50);
    } else if (
      this.game.currentState == this.game.state.over &&
      this.game.announce.medalDone
    ) {
      self.game.context.font = "25px Teko";
        self.game.context.fillText(this.point.value, 208, 214);
        self.game.context.strokeText(this.point.value, 208, 214);

      self.game.context.fillText(this.point.best, 208, 264);
      self.game.context.strokeText(this.point.best, 208, 264);
    }
  };
};
