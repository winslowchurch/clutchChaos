import { createPlayer, handlePlayerMovement, handlePlayerAttack } from './player.js';
import { createMugger, handleMuggerDamage } from './mugger.js';

const config = {
    type: Phaser.AUTO,
    width: 900,
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
    this.load.image('purse', 'images/purse.png');
    this.load.image('purseAttack', 'images/purseAttack.png');
    this.load.image('subwayStation', 'images/subwayStation.png');
    this.load.image('projectile', 'images/projectile.png');
    this.load.image('mugger', 'images/mugger.png');
}

function create() {
    // Add background
    const background = this.add.image(450, 300, 'subwayStation');
    background.setDisplaySize(900, 600);
    
    // Add floor
    this.floor = this.add.rectangle(450, 550, 900, 20, 0x000000);
    this.physics.add.existing(this.floor, true);
    
    // Add player
    this.player = createPlayer(this);
    
    // Add mugger
    this.mugger = createMugger(this);

    // Enable collision with the floor
    this.physics.add.collider(this.player, this.floor);
    this.physics.add.collider(this.mugger, this.floor);
    
    // Handle projectile collision with mugger
    this.projectiles = this.physics.add.group(); // Create a group for projectiles
    this.physics.add.collider(this.projectiles, this.mugger, (projectile, mugger) => {
        handleMuggerDamage(projectile, mugger, this, 1);
    });

    // Input keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
}

function update(time) {
    handlePlayerMovement(this.player, this.cursors, this.wasd);
    handlePlayerAttack(this, this.player, this.cursors, this.wasd, time, this.projectiles);
}
