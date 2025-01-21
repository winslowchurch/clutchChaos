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
let attacking = false;
let attackCooldown = 500; // Cooldown time in milliseconds
let lastAttackTime = 0;

function preload() {
    this.load.image('purse', 'images/purse.png');
    this.load.image('purseAttack', 'images/purseAttack.png'); // Image for attack mode
    this.load.image('subwayStation', 'images/subwayStation.png'); // Background
    this.load.image('projectile', 'images/projectile.png'); // Image for the projectile
}

function create() {
    // Add background
    const background = this.add.image(450, 300, 'subwayStation');
    background.setDisplaySize(900, 600);

    // Add player (purse)
    player = this.physics.add.sprite(400, 400, 'purse');
    player.setScale(100 / player.width, 100 / player.height);
    player.setCollideWorldBounds(true);

    // Add floor
    floor = this.add.rectangle(450, 550, 900, 20, 0x000000);
    this.physics.add.existing(floor, true);
    this.physics.add.collider(player, floor);

    // Input keys
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // Attack function
    attack = (time) => {
        if (attacking) return;

        attacking = true;
        lastAttackTime = time;

        // Switch to attack texture
        player.setTexture('purseAttack');

        // Switch back to normal texture after a delay
        this.time.delayedCall(200, () => {
            player.setTexture('purse');
            attacking = false;
        });

        // Create projectile
        const projectile = this.physics.add.image(player.x, player.y, 'projectile');
        projectile.setVelocityX(300);
        projectile.setScale(20 / projectile.width, 20 / projectile.height);
        projectile.body.allowGravity = false;

        // Destroy projectile after it leaves the screen
        this.time.delayedCall(3000, () => projectile.destroy());
    };
}

function update(time) {
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

    // Attack
    if ((cursors.space.isDown || wasd.space.isDown) && time > lastAttackTime + attackCooldown) {
        attack(time);
    }
}
