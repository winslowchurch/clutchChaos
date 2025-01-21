export function createGirl(scene) {
    const girl = scene.physics.add.sprite(100, 400, 'girl1'); // Initial image
    girl.setCollideWorldBounds(true);

    girl.health = 2;

    // Alternate between two images for the girl
    const girlImages = ['girl1', 'girl2'];
    let currentIndex = 0;

    scene.time.addEvent({
        delay: 500, // Change image every 500ms
        callback: () => {
            currentIndex = (currentIndex + 1) % girlImages.length;
            girl.setTexture(girlImages[currentIndex]);

            // Update the physics body size to match the new texture
            girl.body.setSize(girl.width, girl.height);
        },
        loop: true,
    });

    return girl;
}
