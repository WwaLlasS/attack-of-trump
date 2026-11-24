// Logical game size. Every scene lays out in these units and Phaser scales
// the canvas to fit any screen (see main.js).
var GAME_W = 414;
var GAME_H = 736;

// Internal render resolution multiplier, keeps text crisp on high-DPI screens.
var TEXT_RES = 2;

var FONT = '"Press Start 2P", monospace';

var PLAYER_LIVES = 3;
var PLAYER_SPEED = 200;      // px/s with keyboard
var PLAYER_SCALE = 2;
var BULLET_SPEED = 400;      // px/s
var BULLET_COOLDOWN = 300;   // ms between shots
var ENEMY_BULLET_SPEED = 120;
var ENEMY_POINTS = 20;
var WAVE_BONUS = 200;

// Enemy formation layout.
var FORMATION_COLS = 6;
var FORMATION_ROWS = 5;
var FORMATION_GAP_X = 55;
var FORMATION_GAP_Y = 50;
var ENEMY_W = 34;
var ENEMY_H = 36;

// Adds a text object already configured with the game font.
function addText(scene, x, y, str, size, color) {
  return scene.add.text(x, y, str, {
    fontFamily: FONT,
    fontSize: size + 'px',
    color: color || '#ffffff',
    align: 'center',
    resolution: TEXT_RES
  });
}

// Image button with a short press feedback. Uses pointerup so a press that
// started on another screen doesn't trigger the button here.
function addImageButton(scene, x, y, key, onClick) {
  var btn = scene.add.image(x, y, key).setInteractive({ useHandCursor: true });
  btn.on('pointerover', function () { btn.setTint(0xffeb3b); });
  btn.on('pointerout', function () { btn.clearTint(); });
  btn.on('pointerup', onClick);
  return btn;
}

// Fullscreen is best-effort: unsupported on iOS Safari and some browsers.
function tryFullscreen(scene) {
  var fs = scene.scale.fullscreen;
  if (!fs || !fs.available || scene.scale.isFullscreen) return;
  try {
    scene.scale.startFullscreen();
  } catch (e) {
    // The browser refused; the game still works in a normal window.
  }
}
