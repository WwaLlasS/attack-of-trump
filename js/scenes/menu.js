class MenuScene extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  create() {
    this.add.image(GAME_W / 2, GAME_H / 2, 'menu-bg');

    addImageButton(this, GAME_W / 2, 470, 'btn-start', () => this.startGame());

    if (Scores.load().length > 0) {
      addImageButton(this, GAME_W / 2, 560, 'btn-highscore', () => this.scene.start('highscores'));
    }

    var enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    var space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    enter.on('down', () => this.startGame());
    space.on('down', () => this.startGame());
  }

  startGame() {
    // Everything here must run inside the tap/key gesture: fullscreen and
    // iOS motion permission both require it.
    tryFullscreen(this);
    Tilt.start();
    this.scene.start('game');
  }
}
