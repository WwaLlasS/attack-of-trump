// Waits for the pixel font so the first text drawn uses it, then starts Phaser.
var fontReady = document.fonts
  ? document.fonts.load('16px "Press Start 2P"').catch(function () {})
  : Promise.resolve();

fontReady.then(function () {
  var game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: GAME_W,
    height: GAME_H,
    backgroundColor: '#000000',
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
      activePointers: 2
    },
    scene: [PreloadScene, MenuScene, GameScene, GameOverScene, HighScoresScene]
  });
  window.attackOfTrump = game;
});
