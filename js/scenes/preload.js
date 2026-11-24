class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  preload() {
    var barW = 260;
    var x = (GAME_W - barW) / 2;
    var y = GAME_H / 2;
    addText(this, GAME_W / 2, y - 40, 'LOADING...', 16).setOrigin(0.5);
    this.add.rectangle(x, y, barW, 16).setOrigin(0, 0.5).setStrokeStyle(2, 0xffffff);
    var bar = this.add.rectangle(x + 3, y, 0, 10, 0xffeb3b).setOrigin(0, 0.5);
    this.load.on('progress', function (p) { bar.width = (barW - 6) * p; });

    this.load.setPath('assets/');

    this.load.image('menu-bg', 'img/menu-bg.png');
    this.load.image('starfield', 'img/starfield.png');
    this.load.image('btn-start', 'img/btn-start.png');
    this.load.image('btn-highscore', 'img/btn-highscore.png');
    this.load.image('player', 'img/player.png');
    this.load.image('bullet', 'img/bullet.png');
    this.load.image('enemy-bullet', 'img/enemy-bullet.png');
    this.load.spritesheet('enemy', 'img/enemy.png', { frameWidth: ENEMY_W, frameHeight: ENEMY_H });

    this.load.audio('laser-player', 'sound/laser-player.wav');
    this.load.audio('laser-enemy', 'sound/laser-enemy.mp3');
    this.load.audio('explosion', 'sound/explosion.wav');
    this.load.audio('music', 'sound/music.wav');
  }

  create() {
    // Enemies flap slowly in formation; the explode frame is frame 2.
    this.anims.create({
      key: 'enemy-fly',
      frames: this.anims.generateFrameNumbers('enemy', { frames: [0, 1] }),
      frameRate: 2,
      repeat: -1
    });

    this.scene.start('menu');
  }
}
