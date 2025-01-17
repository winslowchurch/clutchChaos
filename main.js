// Create a new Phaser game
const config = {
    type: Phaser.AUTO, // Automatically choose between WebGL and Canvas
    width: 800, 
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
}

function create() {
    this.add.image(400, 300, 'sky');
}

function update() {
    
}
