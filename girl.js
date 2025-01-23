export function createGirl(scene) {
  const girl = scene.physics.add.sprite(100, 400, "girl1");
  girl.setCollideWorldBounds(true);
  girl.mood = "scared";
  girl.health = 2;

  // Alternate between two images for the girl
  const girlImages = ["girl1", "girl2"];
  let currentIndex = 0;

  scene.time.addEvent({
    delay: 500, // Change image every 500ms
    callback: () => {
      if (!scene || !girl.scene) return;

      if (girl.mood == "happy") {
        girl.setTexture("girlHappy");
      } else if (girl.mood == "scared") {
        // Otherwise alternate between the girl images
        currentIndex = (currentIndex + 1) % girlImages.length;
        girl.setTexture(girlImages[currentIndex]);
      } else if (girl.mood == "dead") {
        girl.setTexture("girlDead");
        girl.y = 600;
      }
      girl.body.setSize(girl.width, girl.height);
    },
    loop: true,
  });

  return girl;
}
