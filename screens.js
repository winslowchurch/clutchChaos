import { config, startGame, levels } from "./main.js";
import { resetMugger } from "./mugger.js";
import { resetGirl } from "./girl.js";
import { resetPlayer } from "./player.js";

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

export function handleLevelEnd(scene) {
  if (scene.currentLevel < levels.length - 1) {
    createNextLevelScreen(scene);
  } else {
    createSuccessScreen(scene);
  }
}

export function createNextLevelScreen(scene) {
  const nextLevelScreen = scene.add.image(
    config.centerWidth,
    config.centerHeight,
    "successScreen"
  );
  const congratsText = createCenteredText(scene, 0, "Nice job!", "100px");

  const nextButton = createCenteredText(scene, 50, "Next Level", "40px");
  nextButton.setInteractive();

  nextButton.on("pointerover", () => {
    nextButton.setStyle({ fontSize: "50px" });
  });

  nextButton.on("pointerout", () => {
    nextButton.setStyle({ fontSize: "40px" });
  });

  nextButton.on("pointerdown", () => {
    scene.sound.play("boopSound");
    nextLevelScreen.destroy();
    congratsText.destroy();
    nextButton.destroy();

    scene.currentLevel += 1;
    resetLevel(scene);
  });

  return nextLevelScreen;
}

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

  const failText = createCenteredText(scene, -60, "YOU FAILED", "70px");
  const randomText =
    failTextOptions[Math.floor(Math.random() * failTextOptions.length)];
  const randomFailText = createCenteredText(scene, 30, randomText, "40px");

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
    failScreen.destroy();
    retryButton.destroy();
    failText.destroy();
    randomFailText.destroy();
    resetLevel(scene);
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

  const text1 = createCenteredText(scene, -100, "How To Play:", "50px");
  const text2 = createCenteredText(scene, -20, "- Use arrow/WASD keys to move");
  const text3 = createCenteredText(scene, 20, "- Hit spacebar to attack");

  const startButton = createCenteredText(scene, 100, "Start", "40px");
  startButton.setInteractive();

  startButton.on("pointerover", () => {
    startButton.setStyle({ fontSize: "50px" });
  });

  startButton.on("pointerout", () => {
    startButton.setStyle({ fontSize: "40px" });
  });

  startButton.on("pointerdown", () => {
    scene.sound.play("boopSound");
    titleScreen.destroy();
    text1.destroy();
    text2.destroy();
    text3.destroy();
    startButton.destroy();
    startGame(scene, 0);
  });

  return titleScreen;
}

export function createBackground(scene) {
  scene.backgrounds = levels[scene.currentLevel].backgrounds;
  const background = scene.add.image(
    config.centerWidth,
    config.centerHeight,
    scene.backgrounds[0]
  );
  background.setDisplaySize(config.width, config.height);

  scene.add.text(20, 10, "Clutch Chaos", {
    fontFamily: "coolFont",
    fontSize: "50px",
    color: "#A64D79",
  });
  return background;
}

function resetBackground(scene) {
  const backgrounds = levels[scene.currentLevel].backgrounds;
  scene.backgrounds = backgrounds;
  scene.background.setTexture(backgrounds[0]);
}

function resetLevel(scene) {
  resetMugger(scene);
  resetPlayer(scene);
  resetGirl(scene);
  resetBackground(scene);
}
