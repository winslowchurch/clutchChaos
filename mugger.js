export function createMugger(scene) {
    const mugger = scene.physics.add.sprite(800, 400, 'mugger');
    mugger.setCollideWorldBounds(true);

    mugger.health = 5;

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
}
