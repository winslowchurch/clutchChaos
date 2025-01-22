import { createPlayer, handlePlayerMovement, handlePlayerAttack } from './player.js';
import { createMugger, handleMuggerDamage, updateHealthBar, handleMuggerShoot } from './mugger.js';
import { createGirl } from "./girl.js";
import { createFailscreen } from "./screens.js";

// TO DO
// Mugger not move all the way back
// Title Screen
// Victory Screen

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
            gravity: { y: 300 },
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
    this.load.image('mugger1', 'images/mugger1.png');
    this.load.image('mugger2', 'images/mugger2.png');
    this.load.image('muggerShoot', 'images/muggerShoot.png');
    this.load.image('muggerDead', 'images/muggerDead.png');
    this.load.image('bullet', 'images/bullet.png');

    this.load.image('girl1', 'images/girl1.png');
    this.load.image('girl2', 'images/girl2.png');
    this.load.image('girlHappy', 'images/happyGirl.png');
    this.load.image('girlDead', 'images/girlDead.png');

    // Screens
    this.load.image('failScreen', 'images/failScreen.png');

    // Sounds
    this.load.audio('lipstickSound', 'assets/whoosh1.mp3');
    this.load.audio('walletSound', 'assets/whoosh2.mp3');
    this.load.audio('coinsSound', 'assets/coin.mp3');
    this.load.audio('successSound', 'assets/success.mp3');
    this.load.audio('gunshotSound', 'assets/gunshot.mp3');
    this.load.css('fontStyle', 'assets/styles.css');
}

function create() {
    this.background = this.add.image(config.width / 2, config.height / 2, 'background1');
    this.background.setDisplaySize(config.width, config.height);

    // Invisible floor
    this.floor = this.add.rectangle(config.width / 2, config.height - 15, config.width, 30, 0x000000);
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

    this.projectiles = this.physics.add.group();
    this.physics.add.collider(this.projectiles, this.mugger, (mugger, projectile) => {
        if (mugger.mood !== "dead") {
            handleMuggerDamage(projectile, mugger, this, 1);
        }
    });

    this.add.text(20, 10, 'Clutch Chaos', {
        fontFamily: 'coolFont',
        fontSize: '50px',
        color: '#A64D79'
    });

    this.bullets = this.physics.add.group();
    this.physics.add.collider(this.bullets, this.girl, (girl, bullet) => {
        bullet.destroy();
        girl.mood = "dead"; 
        createFailscreen(this)
    });

    this.time.addEvent({
        delay: 4000,
        callback: () => {
            if (this.mugger.mood !== "dead") {
                this.mugger.mood = "shooty";
                this.time.delayedCall(500, () => {
                    handleMuggerShoot(this, this.mugger, this.bullets);
                });
            }
        },
        callbackScope: this,
        loop: true,
    });

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
        space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
}

function update(time) {
    handlePlayerMovement(this.player, this.keys);
    handlePlayerAttack(this, this.player, this.keys, time, this.projectiles);
}
