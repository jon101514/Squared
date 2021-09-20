const gameState = {
	lives: 3,
	score: 0,
	maxNumber: 50,
	// CONSTANT
	GRID_WIDTH: 5,
    GRID_HEIGHT: 6,
	CELL_DIMS: 64,
	PADDING: 2,
	INIT_X: 108,
	INIT_Y: 160,
	DECO_FONT: "24px Helvetica",
	INFO_FONT: "18px Verdana"

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
	scene: [StartScene, MainScene, GameOverScene]
};

const game = new Phaser.Game(config);
