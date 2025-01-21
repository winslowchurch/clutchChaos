export function createMugger(scene) {
    const mugger = scene.physics.add.sprite(800, 500, 'mugger');
    mugger.setCollideWorldBounds(true);

    mugger.health = 3;

    return mugger;
}

export function handleMuggerDamage(projectile, mugger, scene, damage) {
    mugger.health -= damage;

    if (projectile) {
        projectile.destroy();
    }

    // Check if the mugger is out of health
    if (mugger.health <= 0) {
        mugger.destroy(); // Remove the mugger from the game
        scene.add.text(400, 300, 'Mugger Defeated!', { fontSize: '32px', color: '#FF0000' });
    } else {
        console.log("toodles")
        // Add visual feedback for damage taken
        mugger.setTint(0xff0000); // Flash red briefly
        scene.time.delayedCall(200, () => mugger.clearTint());
    }
}

