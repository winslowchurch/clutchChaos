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
  "💀💀",
];

const successTextOptions = [
  "Great job!",
  "You nailed it",
  "Sucess!",
  "Awesome!",
  "You killed him!",
  "Gold star 4 u",
  "🤩🤩",
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

  const randomText =
    successTextOptions[Math.floor(Math.random() * successTextOptions.length)];
  const congratsText = createCenteredText(scene, -60, randomText, "70px");

  const nextButton = createCenteredText(scene, 70, "NEXT LEVEL", "60px");
  nextButton.setInteractive();

  nextButton.on("pointerover", () => {
    nextButton.setStyle({ fontSize: "60px" });
  });

  nextButton.on("pointerout", () => {
    nextButton.setStyle({ fontSize: "50px" });
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
    scene.backgroundMusic.play();
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

  const youWonText = createCenteredText(scene, -50, "You win!", "80px");

  const restartButton = createCenteredText(scene, 50, "RESTART", "50px");
  restartButton.setInteractive();

  restartButton.on("pointerover", () => {
    restartButton.setStyle({ fontSize: "60px" });
  });

  restartButton.on("pointerout", () => {
    restartButton.setStyle({ fontSize: "50px" });
  });

  restartButton.on("pointerdown", () => {
    scene.sound.play("boopSound");
    successScreen.destroy();
    restartButton.destroy();
    youWonText.destroy();

    scene.currentLevel = 0;
    resetLevel(scene);
  });

  return successScreen;
}

export function createTitleScreen(scene) {
  const titleScreen = scene.add.image(
    config.centerWidth,
    config.centerHeight,
    "titleScreen"
  );

  const textData = [
    { text: "Don't get mugged!", offset: -100, fontSize: "60px" },
    { text: "- Use arrow/WASD keys to move", offset: -30 },
    { text: "- Hit spacebar to attack", offset: 20 },
    { text: "- Block bullets", offset: 70 },
  ];

  // Create and store text objects
  const textObjects = textData.map((data) =>
    createCenteredText(scene, data.offset, data.text, data.fontSize || "35px")
  );

  const startButton = createCenteredText(scene, 130, "START", "50px");
  startButton.setInteractive();

  startButton.on("pointerover", () => {
    startButton.setStyle({ fontSize: "60px" });
  });

  startButton.on("pointerout", () => {
    startButton.setStyle({ fontSize: "50px" });
  });

  startButton.on("pointerdown", () => {
    scene.sound.play("boopSound");
    titleScreen.destroy();

    // Destroy all text objects
    textObjects.forEach((text) => text.destroy());
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
  console.log(scene.currentLevel);

  resetMugger(scene);
  resetPlayer(scene);
  resetGirl(scene);
  resetBackground(scene);
}
