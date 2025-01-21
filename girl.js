export function createGirl(scene) {
    const girl = scene.physics.add.sprite(100, 400, 'girl');
    girl.setCollideWorldBounds(true);

    girl.health = 2;

    return girl;
}
