const gameState = {
	lives: 3,
	level: 1, // NOTE: LEVEL IS NOT USED AS OF YET
	score: 0,
	maxNumber: 50,
	highScoreReached: false, // When set to true, display an extra animation on GameOverScene.
	// CONSTANT
	GRID_WIDTH: 5,
    GRID_HEIGHT: 6,
	CELL_DIMS: 64,
	PADDING: 2,
	INIT_X: 108,
	INIT_Y: 160,
	DECO_FONT: "24px Helvetica",
	INFO_FONT: "18px Verdana",
	SCORE_FONT: "36px Verdana",
	CENTER_X: 0, // Calculated in StartScene
	CENTER_Y: 0, // Calculated in StartScene
	LS_HISCORE_KEY: "INSQ-highScore",
	LS_HILEVEL_KEY: "INSQ-highLevel",
	DEFAULT_HISCORE: 10,
	DEFAULT_HILEVEL: 5,
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
