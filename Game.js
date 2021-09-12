const gameState = {
	score: 0,
	maxNumber: 50,
	// CONSTANT
	GRID_WIDTH: 5,
    GRID_HEIGHT: 6,
	CELL_DIMS: 64,
	PADDING: 2,
	INIT_X: 100,
	INIT_Y: 128
};



const config = {
	type: Phaser.AUTO,
	width: 480,
	height: 720,
	backgroundColor: "000000",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			enableBody: true,
		}
	},
	scene: [MainScene]
};

const game = new Phaser.Game(config);
