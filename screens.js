import { config, startGame } from "./main.js";

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

  const text1 = createCenteredText(scene, -100, "How To Play:", "50px");
  const text2 = createCenteredText(scene, -50, "- Use arrow/WASD keys to move");
  const text3 = createCenteredText(scene, 0, "- Hit spacebar to attack");

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
    startGame(scene);
    titleScreen.destroy();
    text1.destroy();
    text2.destroy();
    text3.destroy();
    startButton.destroy();
  });

  return titleScreen;
}

export function handleShowBackground(scene) {
  scene.background = scene.add.image(
    config.centerWidth,
    config.centerHeight,
    "street1"
  );
  scene.background.setDisplaySize(config.width, config.height);

  scene.add.text(20, 10, "Clutch Chaos", {
    fontFamily: "coolFont",
    fontSize: "50px",
    color: "#A64D79",
  });

  scene.backgroundMusic = scene.sound.add("backgroundMusic", {
    loop: true,
    volume: 0.5,
  });
  scene.backgroundMusic.play();

  scene.time.addEvent({
    delay: 1000,
    callback: changeBackground(scene),
    callbackScope: scene,
    loop: true,
  });
}

function changeBackground(scene) {
  const backgrounds = ["street1", "street2"];
  const currentTexture = scene.background.texture.key;
  let nextTexture;

  // Find the next texture (cycle through)
  let currentIndex = backgrounds.indexOf(currentTexture);
  let nextIndex = (currentIndex + 1) % backgrounds.length;
  nextTexture = backgrounds[nextIndex];

  // Change the background texture
  scene.background.setTexture(nextTexture);
}
