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

const states = {
	READY: "ready", // the ready prompt before each life or level
	PLAYING: "playing", // normal gameplay play
	LOSING: "losing"
}

const sfx = {
	// absorb, bullet, extend gameover, laser, levelup, lose, move, ready, ui
};

const gameState = {
	lives: 3,
	state: states.READY,
	level: 1,
	score: 0,
	toNextBonus: 0, // NOTE: We set this to EVERY_EXTEND on start.
	minNumber: 1,
	maxNumber: 50,
	expressNum: 5, // Deviation from the target number in the expressions.
	highScoreReached: false, // When set to true, display an extra animation on GameOverScene.
	currentLevelType: levelType.MULTIPLE,
	expressionsMode: expressions.OFF,
	// Scoring variables
	comboTimer: 0, // amount of time the player has to make a match
	comboCount: 1,
	// COLOR/FLAVOR THEMES
	colorFlavorIndex: 0, // Index in the following two arrays
	modifierIndex: -1, // Modifier for the flavors past coffee
	FLAVORS: ["vanilla", "grape", "eggplant", "candy", "lime", "honeydew", "banana", "tangerine", "strawberry", "cocoa", "coffee"],
	COLOR_HEXS: [0xfffff0, 0x9400d3, 0x4b0082, 0x87cefa, 0x008000, 0xadff2f, 0xffff00, 0xff7f50, 0xff0000, 0x8b4513, 0x3e0000],
	COLORS: ["#fffff0", "#9400d3", "#4b0082", "#87cefa", "#008000", "#adff2f", "#ffff00", "#ff7f50", "#ff0000", "#8b4513", "#3e0000"],
	MODIFIERS: ["sweet", "roasted", "fresh", "excellent", "perfect"], 
	// UI CONSTANT
	CRITERIA_HEIGHT: 96, // Positioning criteria and score text
	SCORE_HEIGHT: 60,
	CELL_DIMS: 64,
	PADDING: 2, // Spacing grid cells apart
	INIT_X: 108, // Init coords to spawn the grid
	INIT_Y: 160,
	READY_FONT: "36px Helvetica",
	DECO_FONT: "24px Helvetica",
	INFO_FONT: "18px Verdana",
	INFO_SMALL_FONT: "14px Verdana",
	SCORE_FONT: "36px Verdana",
	COMBO_FONT: "24px Verdana",
	CENTER_X: 0, // Calculated in StartScene
	CENTER_Y: 0, // Calculated in StartScene
	FADE_TIME_SLOW: 1024,
	FADE_TIME_FAST: 256,
	LOSE_TIME: 2500,
	// CONSTANT
	LS_HISCORE_KEY: "INSQ-highScore",
	LS_HILEVEL_KEY: "INSQ-highLevel",
	GRID_WIDTH: 5,
    GRID_HEIGHT: 6,
	DEFAULT_HISCORE: 10,
	DEFAULT_HILEVEL: 5,
	MIN_GRID_THRESHOLD: 0.20,
	REROLL_PERCENT: 0.5,
	// SCORING SYSTEM CONSTANT
	COMBO_TIMER_MAX: 2000,
	BASE_SCORE: 10,
	COMBO_COUNTER_DEPLETE_TIME: 167, // deplete 6 combos per second.
	TOP_OF_GRID_Y: 130,
	BOTTOM_OF_GRID_Y: 522,
	EVERY_EXTEND: 10000,
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
	useTicker: true,
	scene: [StartScene, MainScene, GameOverScene]
};

const game = new Phaser.Game(config);

