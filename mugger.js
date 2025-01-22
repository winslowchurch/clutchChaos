export function createMugger(scene, maxHealth = 10) {
    const mugger = scene.physics.add.sprite(800, 400, 'mugger1');
    mugger.setCollideWorldBounds(true);

    mugger.health = maxHealth;
    mugger.maxHealth = maxHealth;
    mugger.mood = 'pissed';

    // Alternate between two images for the mugger
    const muggerImages = ['mugger1', 'mugger2'];
    let currentIndex = 0;

    scene.time.addEvent({
        delay: 500,
        callback: () => {
            if (mugger.mood == "shooty") {
                mugger.setTexture('muggerShoot');
            } else if (mugger.mood == "pissed") {
                currentIndex = (currentIndex + 1) % muggerImages.length;
                mugger.setTexture(muggerImages[currentIndex]);
            } else if (mugger.mood == "dead") {
                mugger.setTexture('muggerDead');
                mugger.y = 600;
            }
            mugger.body.setSize(mugger.width, mugger.height);
        },
        loop: true,
    });

    return mugger;
}

export function handleMuggerDamage(projectile, mugger, scene, damage) {
    if (!mugger || !projectile) return;
    mugger.health -= damage;

    if (projectile) {
        projectile.destroy();
    }

    if (mugger.health <= 0) {
        scene.sound.play('successSound');
        mugger.mood = "dead";
        scene.girl.mood = "happy";
    } else {
        mugger.setTint(0xff0000);
        scene.time.delayedCall(100, () => mugger.clearTint());
    }

    updateHealthBar(scene, mugger);
}


export function updateHealthBar(scene, mugger) {
    // Clear the current health bar
    scene.healthBar.clear();

    const BAR_LENGTH = 150;

    // Set the position of the health bar
    const barX = scene.cameras.main.width - BAR_LENGTH - 20; // Position from the right
    const barY = 20; // Position from the top

    // Draw the background of the health bar (gray color)
    scene.healthBar.fillStyle(0x000000, 1); // Black background
    scene.healthBar.fillRect(barX, barY, BAR_LENGTH, 20); // Rectangle for background

    // Calculate the width of the health bar based on mugger's health
    const healthPercentage = mugger.health / mugger.maxHealth;
    const healthWidth = BAR_LENGTH * healthPercentage; // Width based on health

    scene.healthBar.fillStyle(0xA64D79, 1); // pink color
    scene.healthBar.fillRect(barX, barY, healthWidth, 20); // Rectangle for health
}

export function handleMuggerShoot(scene, mugger, bullets) {
    const bullet = bullets.create(mugger.x - 50, mugger.y - 50, 'bullet');

    bullet.setVelocityX(-450);
    bullet.body.allowGravity = false;
    scene.sound.play('gunshotSound');

    // Destroy bullet when it leaves the screen
    scene.time.addEvent({
        delay: 4000,
        callback: () => {
            if (bullet.active) bullet.destroy();
        }
    });
    mugger.mood = 'pissed';
}