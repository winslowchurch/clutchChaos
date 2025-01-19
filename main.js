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

let player;
let cursors;
let wasd;
let floor;

function preload() {
    this.load.image('purse', 'images/purse.png');
    this.load.image('me', 'images/me.png');
}

function create() {
    // White background
    this.add.rectangle(450, 300, 900, 600, 0xffffff);

    // Girl
    const meImage = this.add.image(200, 300, 'me');
    meImage.setDisplaySize(400, 400);

    // Floor (visible rectangle)
    floor = this.add.rectangle(450, 500, 900, 20, 0x000000); // Black floor rectangle
    this.physics.add.existing(floor, true); // Make it a static physics object

    // Purse (player)
    player = this.physics.add.image(400, 400, 'purse');
    player.setScale(100 / player.width, 100 / player.height);
    player.setCollideWorldBounds(true);

    // Enable collision with the floor
    this.physics.add.collider(player, floor);

    // Input keys (arrows and WASD)
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
}

function update() {
    // Horizontal movement
    if (cursors.left.isDown || wasd.left.isDown) {
        player.setVelocityX(-160); // Move left
    } else if (cursors.right.isDown || wasd.right.isDown) {
        player.setVelocityX(160); // Move right
    } else {
        player.setVelocityX(0); // Stop horizontal movement
    }

    // Jumping
    if ((cursors.up.isDown || wasd.up.isDown) && player.body.touching.down) {
        player.setVelocityY(-300); // Jump only when touching the floor
    }
}
