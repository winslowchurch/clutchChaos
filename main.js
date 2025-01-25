import {
  createPlayer,
  handlePlayerMovement,
  handlePlayerAttack,
} from "./player.js";
import {
  createMugger,
  updateHealthBar,
  handleMuggerShoot,
  muggerLevelInfo,
} from "./mugger.js";
import { createGirl } from "./girl.js";
import { createTitleScreen, createBackground } from "./screens.js";
import {
  handleFloorCollissions,
  handleProjectilesMuggerCollission,
  handleBulletGirlCollission,
  handleMuggerGirlCollission,
  handlePurseBulletCollission,
} from "./collissions.js";

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
      gravity: { y: 500 },
      debug: false,
    },
  },
};

new Phaser.Game(config);

function preload() {
  // Images
  this.load.image("street1", "images/street1.png");
  this.load.image("street2", "images/street2.png");
  this.load.image("subway1", "images/subway1.png");
  this.load.image("subway2", "images/subway2.png");
  this.load.image("alley1", "images/alley1.png");
  this.load.image("alley2", "images/alley2.png");

  this.load.image("purse", "images/purse.png");
  this.load.image("purseAttack", "images/purseAttack.png");
  this.load.image("lipstick", "images/lipstick.png");
  this.load.image("wallet", "images/wallet.png");
  this.load.image("coins", "images/coins.png");
  this.load.image("keys", "images/keys.png");
  this.load.image("chips", "images/chips.png");
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
  this.load.image("textBubble", "images/textBubble.png");

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
  this.load.audio("popSound", "assets/pop.mp3");
  this.load.audio("thwackSound", "assets/thwack.mp3");

  // Font
  this.load.css("fontStyle", "assets/styles.css");
}

export const levels = [
  {
    backgrounds: ["street1", "street2"],
  },
  {
    backgrounds: ["alley1", "alley2"],
  },
  {
    backgrounds: ["subway1", "subway2"],
  },
];

let gameStarted = false;
function create() {
  // show background
  this.currentLevel = 0;
  this.background = createBackground(this);

  this.time.addEvent({
    delay: 1000,
    callback: () => {
      // alternate background
      const currentTexture = this.background.texture.key;
      let currentIndex = this.backgrounds.indexOf(currentTexture);
      let nextIndex = (currentIndex + 1) % this.backgrounds.length;
      this.background.setTexture(this.backgrounds[nextIndex]);
    },
    callbackScope: this,
    loop: true,
  });

  // play music
  this.backgroundMusic = this.sound.add("backgroundMusic", {
    loop: true,
    volume: 0.5,
  });
  this.backgroundMusic.play();

  if (gameStarted) {
    startGame(this); // Directly start the game
  } else {
    createTitleScreen(this); // Show the title screen
  }
}

export function startGame(scene) {
  // Invisible floor
  scene.floor = scene.add.rectangle(
    config.centerWidth,
    config.height - 15,
    config.width,
    30,
    0x000000
  );
  scene.floor.setAlpha(0);
  scene.physics.add.existing(scene.floor, true);

  scene.girl = createGirl(scene);
  scene.player = createPlayer(scene);
  scene.mugger = createMugger(scene);
  scene.healthBar = scene.add.graphics();
  updateHealthBar(scene, scene.mugger);

  handleFloorCollissions(scene);
  handleProjectilesMuggerCollission(scene);
  handleBulletGirlCollission(scene);
  handleMuggerGirlCollission(scene);
  handlePurseBulletCollission(scene);

  scene.time.addEvent({
    delay: 2000,
    callback: () => {
      if (scene.mugger.mood == "pissed") {
        // chance of shooting gun
        if (
          Math.random() < muggerLevelInfo[scene.currentLevel].chanceOfShooting
        ) {
          scene.mugger.mood = "shooty";
          scene.time.delayedCall(500, () => {
            handleMuggerShoot(scene, scene.mugger);
          });
        }
        // always move forward
        const stepLength = muggerLevelInfo[scene.currentLevel].stepLength;
        scene.mugger.setVelocityX(stepLength);
        scene.time.delayedCall(500, () => {
          scene.mugger.setVelocityX(0);
        });
      }
    },
    callbackScope: scene,
    loop: scene,
  });

  scene.keys = scene.input.keyboard.addKeys({
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
  if (this.player) {
    handlePlayerMovement(this, this.player, this.keys);
    handlePlayerAttack(this, this.player, this.keys, time, this.projectiles);
  }
}
