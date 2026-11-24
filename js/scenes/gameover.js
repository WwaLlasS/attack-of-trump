class GameOverScene extends Phaser.Scene {
  constructor() {
    super('gameover');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    this.add.rectangle(0, 0, GAME_W, GAME_H, 0x000000).setOrigin(0);

    addText(this, GAME_W / 2, GAME_H / 2 - 90, 'GAME OVER', 28).setOrigin(0.5);
    addText(this, GAME_W / 2, GAME_H / 2 - 20, 'Score : ' + this.finalScore, 16).setOrigin(0.5);

    var label = this.finalScore > 0 ? 'SAVE SCORE' : 'CONTINUE';
    var btn = addText(this, GAME_W / 2, GAME_H / 2 + 60, label, 16, '#ffffff')
      .setOrigin(0.5)
      .setPadding(12, 10)
      .setInteractive({ useHandCursor: true });
    btn.on('pointerover', function () { btn.setColor('#ffeb3b'); });
    btn.on('pointerout', function () { btn.setColor('#ffffff'); });

    // Ignore taps that ended the last game, so they don't press this button.
    this.ready = false;
    this.time.delayedCall(400, () => { this.ready = true; });

    btn.on('pointerup', () => {
      if (!this.ready) return;
      this.finish();
    });
  }

  finish() {
    var index = -1;
    if (this.finalScore > 0) {
      index = Scores.add(askName(), this.finalScore);
    }
    this.scene.start('highscores', { highlight: index });
  }
}

// Asks for the player's name. Cancelling or leaving it empty gives a default.
function askName() {
  var name = window.prompt('Enter your name', 'PLAYER');
  name = (name || '').trim().slice(0, 10);
  return name || 'PLAYER';
}
