import {
  createPlayer,
  handlePlayerMovement,
  handlePlayerAttack,
} from "./player.js";
import {
  createMugger,
  handleMuggerDamage,
  updateHealthBar,
  handleMuggerShoot,
} from "./mugger.js";
import { createGirl } from "./girl.js";
import { createFailscreen } from "./screens.js";

// BUGS
// you can still win after chick dies

// TO DO
// instant kill if he touches girl
// More sound effects
// Hook in title screen

export const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  centerWidth: 1000 / 2,
  centerHeight: 600 / 2,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);

function preload() {
  // Images
  this.load.image("street1", "images/street1.png");
  this.load.image("street2", "images/street2.png");

  this.load.image("purse", "images/purse.png");
  this.load.image("purseAttack", "images/purseAttack.png");
  this.load.image("lipstick", "images/lipstick.png");
  this.load.image("wallet", "images/wallet.png");
  this.load.image("coins", "images/coins.png");
  this.load.image("mugger1", "images/mugger1.png");
  this.load.image("mugger2", "images/mugger2.png");
  this.load.image("muggerShoot", "images/muggerShoot.png");
  this.load.image("muggerDead", "images/muggerDead.png");
  this.load.image("muggerHappy", "images/muggerHappy.png");
  this.load.image("bullet", "images/bullet.png");

  this.load.image("girl1", "images/girl1.png");
  this.load.image("girl2", "images/girl2.png");
  this.load.image("girlHappy", "images/happyGirl.png");
  this.load.image("girlDead", "images/girlDead.png");

  // Screens
  this.load.image("failScreen", "images/failScreen.png");
  this.load.image("successScreen", "images/successScreen.png");
  this.load.image("titleScreen", "images/titleScreen.png");

  // Sounds
  this.load.audio("backgroundMusic", "assets/backgroundMusic.mp3");
  this.load.audio("lipstickSound", "assets/whoosh1.mp3");
  this.load.audio("walletSound", "assets/whoosh2.mp3");
  this.load.audio("coinsSound", "assets/coin.mp3");
  this.load.audio("successSound", "assets/success.mp3");
  this.load.audio("gunshotSound", "assets/gunshot.mp3");
  this.load.audio("bwapSound", "assets/bwap.mp3");
  this.load.audio("boingSound", "assets/boing.mp3");
  this.load.audio("boopSound", "assets/boop.wav");

  // Font
  this.load.css("fontStyle", "assets/styles.css");
}

function create() {
  this.background = this.add.image(
    config.centerWidth,
    config.centerHeight,
    "street1"
  );
  this.background.setDisplaySize(config.width, config.height);

  this.add.text(20, 10, "Clutch Chaos", {
    fontFamily: "coolFont",
    fontSize: "50px",
    color: "#A64D79",
  });

  this.backgroundMusic = this.sound.add("backgroundMusic", {
    loop: true,
    volume: 0.5,
  });
  this.backgroundMusic.play();

  this.time.addEvent({
    delay: 1000,
    callback: changeBackground,
    callbackScope: this,
    loop: true,
  });

  // Invisible floor
  this.floor = this.add.rectangle(
    config.centerWidth,
    config.height - 15,
    config.width,
    30,
    0x000000
  );
  this.floor.setAlpha(0);
  this.physics.add.existing(this.floor, true);

  this.player = createPlayer(this);
  this.mugger = createMugger(this);
  this.healthBar = this.add.graphics();
  updateHealthBar(this, this.mugger);
  this.girl = createGirl(this);

  // Player, Mugger, Purse collide with floor
  this.physics.add.collider(this.player, this.floor);
  this.physics.add.collider(this.mugger, this.floor);
  this.physics.add.collider(this.girl, this.floor);

  // Mugger projectiles collision
  this.projectiles = this.physics.add.group();
  this.physics.add.collider(
    this.projectiles,
    this.mugger,
    (mugger, projectile) => {
      if (mugger.mood !== "dead") {
        handleMuggerDamage(projectile, mugger, this, 1);
      } else {
        projectile.destroy();
      }
    }
  );

  // Bullet girl collission
  this.bullets = this.physics.add.group();
  this.physics.add.collider(this.bullets, this.girl, (girl, bullet) => {
    bullet.destroy();
    girl.mood = "dead";
    this.mugger.mood = "happy";
    this.backgroundMusic.stop();
    this.sound.play("bwapSound");
    createFailscreen(this);
  });

  this.time.addEvent({
    delay: 2000,
    callback: () => {
      if (this.mugger.mood == "pissed") {
        // 40% chance of shooting gun
        if (Math.random() < 0.4) {
          this.mugger.mood = "shooty";
          this.time.delayedCall(500, () => {
            handleMuggerShoot(this, this.mugger, this.bullets);
          });
        }
        // move forward
        this.mugger.setVelocityX(-60);
        this.time.delayedCall(500, () => {
          this.mugger.setVelocityX(0);
        });
      }
    },
    callbackScope: this,
    loop: true,
  });

  // Purse destroys bullet
  this.physics.add.collider(this.bullets, this.player, (player, bullet) => {
    bullet.destroy();
  });

  this.keys = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
    arrowUp: Phaser.Input.Keyboard.KeyCodes.UP,
    arrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
    arrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    space: Phaser.Input.Keyboard.KeyCodes.SPACE,
  });
}

function update(time) {
  handlePlayerMovement(this, this.player, this.keys);
  handlePlayerAttack(this, this.player, this.keys, time, this.projectiles);
}

function changeBackground() {
  const backgrounds = ["street1", "street2"];
  const currentTexture = this.background.texture.key;
  let nextTexture;

  // Find the next texture (cycle through)
  let currentIndex = backgrounds.indexOf(currentTexture);
  let nextIndex = (currentIndex + 1) % backgrounds.length;
  nextTexture = backgrounds[nextIndex];

  // Change the background texture
  this.background.setTexture(nextTexture);
}
