class HighScoresScene extends Phaser.Scene {
  constructor() {
    super('highscores');
  }

  init(data) {
    this.highlight = data && typeof data.highlight === 'number' ? data.highlight : -1;
  }

  create() {
    this.add.rectangle(0, 0, GAME_W, GAME_H, 0x000000).setOrigin(0);

    addText(this, GAME_W / 2, 60, 'HIGH SCORES', 22).setOrigin(0.5);

    var list = Scores.load();
    if (list.length === 0) {
      addText(this, GAME_W / 2, GAME_H / 2, 'NO SCORES YET', 14).setOrigin(0.5);
    }

    list.forEach((entry, i) => {
      var y = 120 + i * 45;
      var color = i === this.highlight ? '#ffeb3b' : '#ffffff';
      addText(this, 30, y, (i + 1) + '.', 14, color).setOrigin(0, 0.5);
      addText(this, 80, y, entry.name, 14, color).setOrigin(0, 0.5);
      addText(this, GAME_W - 30, y, String(entry.score), 14, color).setOrigin(1, 0.5);
    });

    addText(this, GAME_W / 2, GAME_H - 60, 'TAP TO CONTINUE', 12).setOrigin(0.5);

    // Ignore taps that ended the previous screen.
    this.ready = false;
    this.time.delayedCall(400, () => { this.ready = true; });

    this.input.on('pointerup', () => {
      if (this.ready) this.scene.start('menu');
    });
    var enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    enter.on('down', () => {
      if (this.ready) this.scene.start('menu');
    });
  }
}
