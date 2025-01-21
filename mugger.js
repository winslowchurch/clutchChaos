export function createMugger(scene) {
    const mugger = scene.physics.add.sprite(800, 500, 'mugger');
    mugger.setCollideWorldBounds(true);

    mugger.health = 3;

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
        scene.add.text(400, 300, 'Mugger Defeated!', { fontSize: '32px', color: '#FF0000' });
    } else {
        mugger.setTint(0xff0000);
        scene.time.delayedCall(200, () => mugger.clearTint());
    }
}
