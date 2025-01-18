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
            gravity: { y: 0 }, // No gravity for top-down movement
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

let player;

function preload() {
    this.load.image('purse', 'images/purse.png');
    this.load.image('me', 'images/me.png');
}

function create() {
    this.add.rectangle(400, 300, 900, 600, 0xffffff);
    const meImage = this.add.image(200, 300, 'me');
    meImage.setDisplaySize(400, 400);

    player = this.physics.add.image(400, 400, 'purse');
    player.setScale(100 / player.width, 100 / player.height);
    player.setCollideWorldBounds(true);
}

function update() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
    } else {
        player.setVelocityY(0);
    }
}
