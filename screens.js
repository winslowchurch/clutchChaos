import { config } from "./main.js";

function createCenteredText(
  scene,
  yOffset,
  text,
  fontSize = "35px",
  color = "#FFFFFF"
) {
  const textObj = scene.add.text(
    config.centerWidth,
    config.centerHeight + yOffset,
    text,
    {
      fontFamily: "coolFont",
      fontSize: fontSize,
      color: color,
    }
  );
  textObj.setOrigin(0.5);
  return textObj;
}

const failTextOptions = [
  "Better luck next time",
  "He touched her no-no square",
  ":(",
  "You let him shoot her?!!!",
  "That's embarassing for you",
  "You're not very good at this",
  "At least you tried",
];

export function handleFailScenario(scene) {
  scene.girl.mood = "dead";
  scene.mugger.mood = "happy";
  scene.backgroundMusic.stop();
  scene.sound.play("bwapSound");
  createFailscreen(scene);
}

export function createFailscreen(scene) {
  const failScreen = scene.add.image(
    config.centerWidth,
    config.centerHeight,
    "failScreen"
  );

  createCenteredText(scene, -60, "YOU FAILED", "70px");
  const randomFailText =
    failTextOptions[Math.floor(Math.random() * failTextOptions.length)];
  createCenteredText(scene, 30, randomFailText, "40px");

  const retryButton = createCenteredText(scene, 100, "Try Again", "40px");
  retryButton.setInteractive();

  retryButton.on("pointerover", () => {
    retryButton.setStyle({ fontSize: "50px" });
  });

  retryButton.on("pointerout", () => {
    retryButton.setStyle({ fontSize: "40px" });
  });

  retryButton.on("pointerdown", () => {
    scene.sound.play("boopSound");
    scene.scene.restart();
  });

  return failScreen;
}

export function createSuccessScreen(scene) {
  const successScreen = scene.add.image(
    config.centerWidth,
    config.centerHeight,
    "successScreen"
  );

  createCenteredText(scene, 0, "You win!", "100px");

  return successScreen;
}

export function createTitleScreen(scene) {
  const titleScreen = scene.add.image(
    config.centerWidth,
    config.centerHeight,
    "titleScreen"
  );

  createCenteredText(scene, -100, "How To Play:", "50px");
  createCenteredText(scene, -50, "- Use arrow/WASD keys to move");
  createCenteredText(scene, 0, "- Hit spacebar to attack");

  const startButton = createCenteredText(scene, 50, "Start", "40px");
  startButton.setInteractive();

  startButton.on("pointerover", () => {
    startButton.setStyle({ fontSize: "50px" });
  });

  startButton.on("pointerout", () => {
    startButton.setStyle({ fontSize: "40px" });
  });

  startButton.on("pointerdown", () => {
    scene.sound.play("boopSound");
    // start level
  });

  return titleScreen;
}
