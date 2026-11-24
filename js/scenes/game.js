// Milliseconds between enemy shots, getting faster as the waves go on.
function enemyFireDelay(wave) {
  if (wave >= 35) return 300;
  if (wave >= 25) return 400;
  if (wave >= 20) return 600;
  if (wave >= 15) return 800;
  if (wave >= 10) return 1000;
  if (wave >= 5) return 1500;
  return 2000;
}

function overlaps(a, b) {
  return Phaser.Geom.Intersects.RectangleToRectangle(a.getBounds(), b.getBounds());
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  init() {
    this.score = 0;
    this.lives = PLAYER_LIVES;
    this.wave = 1;
    this.playerAlive = true;
    this.bulletTime = 0;
    this.firingTimer = 0;
    this.playerBullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.swing = { x: 0 };
    this.swingTween = null;
    this.waveToken = 0;
  }

  create() {
    this.starfield = this.add.tileSprite(0, 0, GAME_W, GAME_H, 'starfield').setOrigin(0, 0);

    this.music = this.sound.add('music', { loop: true, volume: 0.6 });
    this.music.play();
    this.sfxLaserPlayer = this.sound.add('laser-player', { volume: 0.5 });
    this.sfxLaserEnemy = this.sound.add('laser-enemy', { volume: 1 });
    this.sfxExplosion = this.sound.add('explosion', { volume: 0.8 });

    this.player = this.add.image(GAME_W / 2, GAME_H - 100, 'player').setScale(PLAYER_SCALE);

    this.lifeIcons = [];
    for (var i = 0; i < PLAYER_LIVES; i++) {
      this.lifeIcons.push(this.add.image(GAME_W - 90 + 30 * i, GAME_H - 20, 'player').setAlpha(0.5));
    }

    this.scoreText = addText(this, 10, GAME_H - 25, '', 10).setOrigin(0, 0.5);
    this.addScore(0);
    addText(this, GAME_W / 2, GAME_H - 25, 'Lives', 10).setOrigin(0.5);

    this.waveText = addText(this, GAME_W / 2, GAME_H / 2, '', 20).setOrigin(0.5);
    this.showWave();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({ left: 'A', right: 'D', fire: 'SPACE' });

    this.createFormation();
  }

  update(time, delta) {
    var dt = delta / 1000;

    this.starfield.tilePositionY += 120 * dt;
    this.updatePlayer(dt, time);
    this.updateFormation();

    if (this.playerAlive && time > this.firingTimer && this.enemies.length > 0) {
      this.fireEnemy(time);
    }

    this.updateBullets(dt);
    this.checkCollisions();

    if (this.enemies.length === 0) {
      this.nextWave();
    }
  }

  updatePlayer(dt, time) {
    if (!this.playerAlive) return;

    var vx = 0;
    if (this.cursors.left.isDown || this.keys.left.isDown) {
      vx = -PLAYER_SPEED;
    } else if (this.cursors.right.isDown || this.keys.right.isDown) {
      vx = PLAYER_SPEED;
    } else {
      vx = Tilt.velocityX();
    }

    var half = this.player.displayWidth / 2;
    this.player.x = Phaser.Math.Clamp(this.player.x + vx * dt, half, GAME_W - half);

    if (this.keys.fire.isDown || this.input.activePointer.isDown) {
      this.fireBullet(time);
    }
  }

  fireBullet(time) {
    if (time <= this.bulletTime) return;
    this.bulletTime = time + BULLET_COOLDOWN;

    var bullet = this.add.image(this.player.x, this.player.y - 12, 'bullet');
    bullet.vy = -BULLET_SPEED;
    this.playerBullets.push(bullet);
    this.sfxLaserPlayer.play();
  }

  fireEnemy(time) {
    this.firingTimer = time + enemyFireDelay(this.wave);

    var shooters = this.enemies.filter(function (e) { return !e.dying; });
    if (shooters.length === 0) return;
    var shooter = shooters[Phaser.Math.Between(0, shooters.length - 1)];

    var bullet = this.add.image(shooter.x, shooter.y + 20, 'enemy-bullet');
    var angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, this.player.x, this.player.y);
    bullet.vx = Math.cos(angle) * ENEMY_BULLET_SPEED;
    bullet.vy = Math.sin(angle) * ENEMY_BULLET_SPEED;
    this.enemyBullets.push(bullet);
    this.sfxLaserEnemy.play();
  }

  createFormation() {
    var formationW = (FORMATION_COLS - 1) * FORMATION_GAP_X + ENEMY_W;
    var left = (GAME_W - formationW) / 2 + ENEMY_W / 2;
    // How far the formation sways left and right.
    var sway = (GAME_W - formationW) / 2 - 8;

    for (var row = 0; row < FORMATION_ROWS; row++) {
      for (var col = 0; col < FORMATION_COLS; col++) {
        var enemy = this.add.sprite(0, 0, 'enemy').play('enemy-fly');
        enemy.baseX = left + col * FORMATION_GAP_X;
        enemy.baseY = 60 + row * FORMATION_GAP_Y;
        enemy.dying = false;
        this.enemies.push(enemy);
      }
    }

    this.swing.x = -sway;
    if (this.swingTween) this.swingTween.stop();
    this.swingTween = this.tweens.add({
      targets: this.swing,
      x: sway,
      duration: 2000,
      ease: 'Linear',
      yoyo: true,
      repeat: -1
    });
    this.updateFormation();
  }

  updateFormation() {
    this.enemies.forEach((e) => {
      e.x = e.baseX + this.swing.x;
      e.y = e.baseY;
    });
  }

  updateBullets(dt) {
    this.playerBullets = this.playerBullets.filter((b) => {
      b.y += b.vy * dt;
      if (b.y < -20) {
        b.destroy();
        return false;
      }
      return true;
    });

    this.enemyBullets = this.enemyBullets.filter((b) => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.rotation += 6 * dt;
      if (b.x < -30 || b.x > GAME_W + 30 || b.y > GAME_H + 30) {
        b.destroy();
        return false;
      }
      return true;
    });
  }

  checkCollisions() {
    this.playerBullets = this.playerBullets.filter((b) => {
      var hit = this.enemies.find((e) => !e.dying && overlaps(b, e));
      if (!hit) return true;
      b.destroy();
      this.killEnemy(hit);
      return false;
    });

    if (this.playerAlive && this.enemyBullets.some((b) => overlaps(b, this.player))) {
      this.hitPlayer();
    }
  }

  killEnemy(enemy) {
    enemy.dying = true;
    enemy.stop();
    enemy.setFrame(2);
    this.sfxExplosion.play();
    this.addScore(ENEMY_POINTS);

    this.time.delayedCall(300, () => {
      this.enemies = this.enemies.filter((e) => e !== enemy);
      enemy.destroy();
    });
  }

  hitPlayer() {
    this.playerAlive = false;
    this.clearBullets();
    this.sfxExplosion.play();
    this.player.setVisible(false);

    this.lives--;
    this.lifeIcons[this.lives].setVisible(false);

    if (this.lives <= 0) {
      this.time.delayedCall(300, () => this.gameOver());
      return;
    }

    this.time.delayedCall(500, () => {
      this.player.x = GAME_W / 2;
      this.player.setVisible(true);
      this.playerAlive = true;
    });
  }

  nextWave() {
    this.wave++;
    this.addScore(WAVE_BONUS);
    this.clearBullets();
    this.player.x = GAME_W / 2;
    this.createFormation();
    this.showWave();
  }

  showWave() {
    var token = ++this.waveToken;
    this.waveText.setText('Wave ' + this.wave).setVisible(true);
    this.time.delayedCall(1500, () => {
      if (token === this.waveToken) this.waveText.setVisible(false);
    });
  }

  clearBullets() {
    this.playerBullets.forEach((b) => b.destroy());
    this.enemyBullets.forEach((b) => b.destroy());
    this.playerBullets = [];
    this.enemyBullets = [];
  }

  addScore(points) {
    this.score += points;
    this.scoreText.setText('Score : ' + this.score);
  }

  gameOver() {
    this.music.stop();
    this.scene.start('gameover', { score: this.score });
  }
}
