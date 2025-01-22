import { createPlayer, handlePlayerMovement, handlePlayerAttack } from './player.js';
import { createMugger, handleMuggerDamage, updateHealthBar } from './mugger.js';
import { createGirl } from "./girl.js";

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }, // Gravity applied to all objects
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Images
    this.load.image('background1', 'images/background1.png');
    this.load.image('background2', 'images/background2.png');

    this.load.image('purse', 'images/purse.png');
    this.load.image('purseAttack', 'images/purseAttack.png');
    this.load.image('lipstick', 'images/lipstick.png');
    this.load.image('wallet', 'images/wallet.png');
    this.load.image('coins', 'images/coins.png');
    this.load.image('mugger', 'images/mugger.png');

    this.load.image('girl1', 'images/girl1.png'); 
    this.load.image('girl2', 'images/girl2.png');

    // Sounds
    this.load.audio('lipstickSound', 'assets/whoosh1.mp3');
    this.load.audio('walletSound', 'assets/whoosh2.mp3');
    this.load.audio('coinsSound', 'assets/coin.mp3');
}

function create() {
    // Add initial background
    this.background = this.add.image(config.width / 2, config.height / 2, 'background1');
    this.background.setDisplaySize(config.width, config.height);

    // Start cycling through backgrounds every 5 seconds
    this.time.addEvent({
        delay: 1000, // 5 seconds
        callback: changeBackground,
        callbackScope: this,
        loop: true
    });

    // Create an invisible floor
    this.floor = this.add.rectangle(config.width / 2, config.height - 15, config.width, 30, 0x000000);
    this.floor.setAlpha(0);
    this.physics.add.existing(this.floor, true);

    // Add player
    this.player = createPlayer(this);
    
    // Add mugger and health bar
    this.mugger = createMugger(this);
    this.healthBar = this.add.graphics();
    updateHealthBar(this, this.mugger);

    // Add girl
    this.girl = createGirl(this);

    // Enable collision with the floor
    this.physics.add.collider(this.player, this.floor);
    this.physics.add.collider(this.mugger, this.floor);
    this.physics.add.collider(this.girl, this.floor);

    // Handle projectile collision with mugger
    this.projectiles = this.physics.add.group(); // Create a group for projectiles
    this.physics.add.collider(this.projectiles, this.mugger, (mugger, projectile) => {
        handleMuggerDamage(projectile, mugger, this, 1);
    });
    
    this.keys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        arrowUp: Phaser.Input.Keyboard.KeyCodes.UP,
        arrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
        arrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
}

function update(time) {
    handlePlayerMovement(this.player, this.keys);
    handlePlayerAttack(this, this.player, this.keys, time, this.projectiles);
}

function changeBackground() {
    const backgrounds = ['background1', 'background2'];
    const currentTexture = this.background.texture.key;
    let nextTexture;

    // Find the next texture
    let currentIndex = backgrounds.indexOf(currentTexture);
    let nextIndex = (currentIndex + 1) % backgrounds.length;
    nextTexture = backgrounds[nextIndex];

    // Change the background texture
    this.background.setTexture(nextTexture);
}
