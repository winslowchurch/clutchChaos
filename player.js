let attacking = false;
let attackCooldown = 500;
let lastAttackTime = 0;

export function createPlayer(scene) {
  const player = scene.physics.add.sprite(200, 400, "purse");
  player.setCollideWorldBounds(true);
  return player;
}

export function handlePlayerMovement(scene, player, keys) {
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
    scene.sound.play("boingSound");
    player.setVelocityY(-350); // Jump only when touching the floor
  }
}

export function handlePlayerAttack(scene, player, keys, time, projectiles) {
  if (keys.space.isDown && time > lastAttackTime + attackCooldown) {
    attacking = true;
    lastAttackTime = time;

    // Switch to attack texture
    player.setTexture("purseAttack");
    scene.time.delayedCall(200, () => {
      player.setTexture("purse");
      attacking = false;
    });
    player.setVelocityY(-50);

    // Randomly select a projectile type
    const projectileImages = ["lipstick", "wallet", "coins"];
    const randomProjectile = Phaser.Utils.Array.GetRandom(projectileImages);

    // Create the projectile
    const projectile = projectiles.create(player.x, player.y, randomProjectile);
    projectile.setVelocityX(300);
    projectile.body.allowGravity = false;

    switch (randomProjectile) {
      case "lipstick":
        scene.sound.play("lipstickSound");
        break;
      case "wallet":
        scene.sound.play("walletSound");
        break;
      case "coins":
        scene.sound.play("coinsSound");
        break;
    }

    // Make the projectile spin
    projectile.rotationSpeed = 0.1;

    // Update function to spin the projectile
    scene.events.on("update", () => {
      if (projectile.active) {
        projectile.rotation += projectile.rotationSpeed; // Update the rotation on each frame
      }
    });

    // Destroy projectile after it leaves the screen
    scene.time.delayedCall(3000, () => projectile.destroy());
  }
}
