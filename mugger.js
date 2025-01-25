import { handleLevelEnd } from "./screens.js";
import { handleGirlCelebrating } from "./girl.js";

export const muggerLevelInfo = [
  {
    health: "8",
    gunSpeed: "-400",
    chanceOfShooting: 0.2,
    stepLength: -40,
  },
  {
    health: "12",
    gunSpeed: "-500",
    chanceOfShooting: 0.4,
    stepLength: -80,
  },
  {
    health: "15",
    gunSpeed: "-600",
    chanceOfShooting: 0.6,
    stepLength: -130,
  },
];

const complaintOptions = [
  "WTF!",
  "Hey!",
  "Ow!",
  "?!!",
  "&@$%*!",
  "Ouch!",
  "TF?",
  "🤬🤬",
  ">:(",
];

export function createMugger(scene) {
  const mugger = scene.physics.add.sprite(800, 400, "mugger1");
  mugger.setCollideWorldBounds(true);

  mugger.health = muggerLevelInfo[scene.currentLevel].health;
  mugger.mood = "pissed";
  mugger.gunSpeed = muggerLevelInfo[scene.currentLevel].gunSpeed;
  mugger.complaining = false;

  // Alternate between two images for the mugger
  const muggerImages = ["mugger1", "mugger2"];
  let currentIndex = 0;

  scene.time.addEvent({
    delay: 500,
    callback: () => {
      if (!scene || !mugger.scene) return;

      if (mugger.mood == "shooty") {
        mugger.setTexture("muggerShoot");
      } else if (mugger.mood == "pissed") {
        currentIndex = (currentIndex + 1) % muggerImages.length;
        mugger.setTexture(muggerImages[currentIndex]);
      } else if (mugger.mood == "dead") {
        mugger.setTexture("muggerDead");
        mugger.y = 600;
      } else if (mugger.mood == "happy") {
        mugger.setTexture("muggerHappy");
      }
      mugger.body.setSize(mugger.width, mugger.height);
    },
    loop: true,
    callbackScope: scene,
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
    scene.sound.play("successSound");
    mugger.mood = "dead";
    scene.girl.mood = "happy";
    handleGirlCelebrating(scene);
    handleLevelEnd(scene);
  } else {
    // Apply a small knockback force to the mugger
    const knockbackForce = 150;
    mugger.setVelocityX(knockbackForce);
    scene.time.delayedCall(100, () => mugger.setVelocityX(0)); // Stop movement after a short delay

    mugger.setTint(0xff0000);
    scene.time.delayedCall(200, () => mugger.clearTint());
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
  const healthPercentage =
    mugger.health / muggerLevelInfo[scene.currentLevel].health;
  const healthWidth = BAR_LENGTH * healthPercentage; // Width based on health

  scene.healthBar.fillStyle(0xa64d79, 1); // pink color
  scene.healthBar.fillRect(barX, barY, healthWidth, 20); // Rectangle for health
}

export function handleMuggerShoot(scene, mugger, bullets) {
  const bullet = bullets.create(mugger.x - 50, mugger.y - 50, "bullet");

  bullet.setVelocityX(mugger.gunSpeed);
  bullet.body.allowGravity = false;
  scene.sound.play("gunshotSound", { volume: 0.4 });

  // Destroy bullet when it leaves the screen
  scene.time.addEvent({
    delay: 4000,
    callback: () => {
      if (bullet.active) bullet.destroy();
    },
  });
  mugger.mood = "pissed";
}

export function resetMugger(scene) {
  scene.mugger.setPosition(800, 350);
  scene.mugger.mood = "pissed";
  scene.mugger.health = muggerLevelInfo[scene.currentLevel].health;
  updateHealthBar(scene, scene.mugger);
}

export function playMuggerComplaint(scene) {
  scene.sound.play("thwackSound");

  if (Math.random() < 0.5 && !scene.mugger.complaining) {
    scene.mugger.complaining = true;
    const { textBubble, bubbleText } = showTextBubble(
      scene,
      scene.mugger.x,
      scene.mugger.y,
      complaintOptions
    );
    scene.time.addEvent({
      delay: 3000,
      callback: () => {
        textBubble.destroy();
        bubbleText.destroy();
        scene.mugger.complaining = false;
      },
    });
  }
}

export function showTextBubble(scene, x, y, textOptions) {
  const textBubble = scene.add.image(x, y - 230, "textBubble");

  const bubbleBounds = textBubble.getBounds();
  const textX = bubbleBounds.centerX;
  const textY = bubbleBounds.centerY - 10;

  const randomText =
    textOptions[Math.floor(Math.random() * textOptions.length)];
  const bubbleText = scene.add.text(textX, textY, randomText, {
    fontFamily: "coolFont",
    fontSize: "45px",
    color: "#000000",
  });
  bubbleText.setOrigin(0.5);

  return { textBubble, bubbleText };
}
