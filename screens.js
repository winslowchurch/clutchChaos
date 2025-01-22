import { config } from "./main.js";

export function createFailscreen(scene) {
    const failScreen = scene.add.image(config.centerWidth, config.centerHeight, 'failScreen');

    // Add fail text
    const failText = scene.add.text(config.centerWidth, 250, 'YOU FAILED', {
        fontFamily: 'coolFont',
        fontSize: '70px',
        color: '#FFFFFF'
    });
    failText.setOrigin(0.5);

    // Add retry button
    const retryButton = scene.add.text(config.centerWidth, 380, 'Try Again', {
        fontFamily: 'coolFont',
        fontSize: '40px',
        color: '#FFFFFF',
        padding: { x: 10, y: 5 }
    });
    retryButton.setOrigin(0.5);
    retryButton.setInteractive();

    // Add hover effect to change text size
    retryButton.on('pointerover', () => {
        retryButton.setStyle({ fontSize: '50px' }); // Increase font size
        retryButton.setOrigin(0.5); // Re-center the text
    });

    retryButton.on('pointerout', () => {
        retryButton.setStyle({ fontSize: '40px' }); // Reset font size
        retryButton.setOrigin(0.5); // Re-center the text
    });

    // Restart the game on retry button click
    retryButton.on('pointerdown', () => {
        scene.scene.restart();
    });

    return failScreen;
}

export function createSuccessScreen(scene) {
    const successScreen = scene.add.image(config.centerWidth, config.centerHeight, 'successScreen');

    // You win text
    const youWinText = scene.add.text(config.centerWidth, config.centerHeight, 'You win!', {
        fontFamily: 'coolFont',
        fontSize: '100px',
        color: '#FFFFFF'
    });
    youWinText.setOrigin(0.5);

    return successScreen;
}