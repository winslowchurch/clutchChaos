let attacking = false;
let attackCooldown = 500;
let lastAttackTime = 0;

export function createPlayer(scene) {
    const player = scene.physics.add.sprite(400, 400, 'purse');
    player.setCollideWorldBounds(true);
    return player;
}

export function handlePlayerMovement(player, cursors, wasd) {
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

export function handlePlayerAttack(scene, player, cursors, wasd, time, projectiles) {
    if ((cursors.space.isDown || wasd.space.isDown) && time > lastAttackTime + attackCooldown) {
        attacking = true;
        lastAttackTime = time;

        // Switch to attack texture
        player.setTexture('purseAttack');
        scene.time.delayedCall(200, () => {
            player.setTexture('purse');
            attacking = false;
        });
        player.setVelocityY(-50);

        // Create projectile
        const projectile = projectiles.create(player.x, player.y, 'projectile');
        projectile.setVelocityX(300);
        projectile.setScale(20 / projectile.width, 20 / projectile.height);
        projectile.body.allowGravity = false;

        // Destroy projectile after it leaves the screen
        scene.time.delayedCall(3000, () => projectile.destroy());
    }
}
