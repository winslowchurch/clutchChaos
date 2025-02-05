import { showTextBubble } from "./mugger.js";

const happyTextOptions = ["Yay!", "Phew!", "⭐️⭐️", "Yipee!", "Omg..."];

export function createGirl(scene) {
  const girl = scene.physics.add.sprite(100, 400, "girl1");
  girl.setCollideWorldBounds(true);
  girl.mood = "scared";

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

export function handleGirlCelebrating(scene) {
  if (!scene.girl.talking) {
    scene.girl.talking = true;
    const { textBubble, bubbleText } = showTextBubble(
      scene,
      scene.girl.x,
      scene.girl.y,
      happyTextOptions
    );
    scene.time.addEvent({
      delay: 3000,
      callback: () => {
        textBubble.destroy();
        bubbleText.destroy();
        scene.girl.talking = false;
      },
    });
  }
}

export function resetGirl(scene) {
  scene.girl.mood = "scared";
  scene.girl.setPosition(100, 350);
}
