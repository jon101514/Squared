const levelType = {
	MULTIPLE: "multiple",
	FACTOR: "factor",
	PRIME: "prime",
	EQUALITY: "equality",
	INEQUALITY: "inequality"
};

const expressions = {
	OFF: "off",
	ON: "on",
	MIXED: "mixed"
};

const gameState = {
	lives: 3,
	level: 1,
	score: 0,
	minNumber: 1,
	maxNumber: 50,
	expressNum: 5, // Deviation from the target number in the expressions.
	highScoreReached: false, // When set to true, display an extra animation on GameOverScene.
	currentLevelType: levelType.MULTIPLE,
	expressionsMode: expressions.OFF,
	// COLOR/FLAVOR THEMES
	colorFlavorIndex: 0, // Index in the following two arrays
	FLAVORS: ["vanilla", "grape", "eggplant", "candy", "lime", "honeydew", "banana", "tangerine", "strawberry", "cocoa", "coffee"],
	COLOR_HEXS: [0xfffff0, 0x9400d3, 0x4b0082, 0x87cefa, 0x008000, 0xadff2f, 0xffff00, 0xff7f50, 0xff0000, 0x8b4513, 0x3e0000],
	COLORS: ["#fffff0", "#9400d3", "#4b0082", "#87cefa", "#008000", "#adff2f", "#ffff00", "#ff7f50", "#ff0000", "#8b4513", "#3e0000"],
	// UI CONSTANT
	CRITERIA_HEIGHT: 96, // Positioning criteria and score text
	SCORE_HEIGHT: 60,
	CELL_DIMS: 64,
	PADDING: 2, // Spacing grid cells apart
	INIT_X: 108, // Init coords to spawn the grid
	INIT_Y: 160,
	DECO_FONT: "24px Helvetica",
	INFO_FONT: "18px Verdana",
	INFO_SMALL_FONT: "14px Verdana",
	SCORE_FONT: "36px Verdana",
	CENTER_X: 0, // Calculated in StartScene
	CENTER_Y: 0, // Calculated in StartScene
	FADE_TIME_SLOW: 1024,
	FADE_TIME_FAST: 256,
	// CONSTANT
	LS_HISCORE_KEY: "INSQ-highScore",
	LS_HILEVEL_KEY: "INSQ-highLevel",
	GRID_WIDTH: 5,
    GRID_HEIGHT: 6,
	DEFAULT_HISCORE: 10,
	DEFAULT_HILEVEL: 5,
	MIN_GRID_THRESHOLD: 0.20,
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
