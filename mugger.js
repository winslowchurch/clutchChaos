export function createMugger(scene, maxHealth = 10) {
    const mugger = scene.physics.add.sprite(800, 400, 'mugger');
    mugger.setCollideWorldBounds(true);

    mugger.health = maxHealth;
    mugger.maxHealth = maxHealth;

    return mugger;
}

export function handleMuggerDamage(projectile, mugger, scene, damage) {
    if (!mugger || !projectile) return;
    mugger.health -= damage;

    if (projectile) {
        projectile.destroy();
    }

    if (mugger.health <= 0) {
        mugger.destroy();
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

    scene.healthBar.fillStyle(0xA64D79, 1); 
    scene.healthBar.fillRect(barX, barY, healthWidth, 20); // Rectangle for health
}
