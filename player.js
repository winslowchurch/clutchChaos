let attacking = false;
let attackCooldown = 500;
let lastAttackTime = 0;

export function createPlayer(scene) {
    const player = scene.physics.add.sprite(400, 400, 'purse');
    player.setCollideWorldBounds(true);
    return player;
}

export function handlePlayerMovement(player, keys) {
    // Horizontal movement
    if (keys.left.isDown || keys.arrowLeft.isDown) {
        player.setVelocityX(-160); // Move left
    } else if (keys.right.isDown || keys.arrowRight.isDown) {
        player.setVelocityX(160); // Move right
    } else {
        player.setVelocityX(0); // Stop horizontal movement
    }

    // Jumping
    if ((keys.up.isDown || keys.arrowUp.isDown) && player.body.touching.down) {
        player.setVelocityY(-300); // Jump only when touching the floor
    }
}

export function handlePlayerAttack(scene, player, keys, time, projectiles) {
    if ((keys.space.isDown) && time > lastAttackTime + attackCooldown) {
        attacking = true;
        lastAttackTime = time;

        // Switch to attack texture
        player.setTexture('purseAttack');
        scene.time.delayedCall(200, () => {
            player.setTexture('purse');
            attacking = false;
        });
        player.setVelocityY(-50);

        // Randomly select a projectile type
        const projectileImages = ['lipstick', 'wallet', 'coins'];
        const randomProjectile = Phaser.Utils.Array.GetRandom(projectileImages);

        // Create the projectile
        const projectile = projectiles.create(player.x, player.y, randomProjectile);
        projectile.setVelocityX(300);
        projectile.body.allowGravity = false;

        // Make the projectile spin
        projectile.rotationSpeed = 0.1; // Adjust this value for faster/slower rotation

        // Update function to spin the projectile
        scene.events.on('update', () => {
            if (projectile.active) {
                projectile.rotation += projectile.rotationSpeed;  // Update the rotation on each frame
            }
        });

        // Destroy projectile after it leaves the screen
        scene.time.delayedCall(3000, () => projectile.destroy());
    }
}


