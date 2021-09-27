class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScene' })
	}

	preload() {
		this.load.image('logo', 'assets/logo.png');
		this.load.audio('ui', ['assets/ui.mp3', 'assets/ui.ogg']);
	}

	/**
	 * Setup the center of the screen as well as initialization of hi scores,
	 * then create a logo, credits, and start prompt.
	 */
	create() {
		sfx.ui = this.sound.add('ui');
		this.calcCenterCoordinates();
		this.initializeLocalStorage();
		this.add.image(gameState.CENTER_X, gameState.CENTER_Y / 2, 'logo').setOrigin(0.5);
		this.add.text(gameState.CENTER_X, gameState.CENTER_Y, `SPACE TO START`, {
			font: gameState.INFO_FONT,
            fill: '#00ffff'
        }).setOrigin(0.5);
		gameState.creditsText = this.add.text(192, 684, `Created by Jon So, 2021`, {
            font: gameState.DECO_FONT,
            fill: '#ffffff'
        });
		gameState.cursors = this.input.keyboard.createCursorKeys(); // To take input to start
	}

	/**
	 * Handle pressing space to begin playing.
	 */
	update() {
		if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space)) {
			this.fadeStartGame();
		}
	}

	/**
	 * Fade to black for about a second and then start the game
	 */
	fadeStartGame() {
		sfx.ui.play();
		this.cameras.main.fade(gameState.FADE_TIME_SLOW, 0, 0, 0, false, function(camera, progress) {
			if (progress >= 1.0) {
				this.scene.stop('StartScene');
				this.scene.start('MainScene');
			}
		});
	}

	/**
	 * Helper that calculates the center coordinates of the screen to easily center text.
	 * From Stephen Garside's https://www.stephengarside.co.uk/blog/phaser-3-center-text-in-middle-of-screen/
	 */
	calcCenterCoordinates() {
		gameState.CENTER_X = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		gameState.CENTER_Y = this.cameras.main.worldView.y + this.cameras.main.height / 2;
	}

	/**
     * If no values have been assigned in localStorage, then give them default values.
     */
	 initializeLocalStorage() {
        if (localStorage.getItem(gameState.LS_HISCORE_KEY) == null) {
			localStorage.setItem(gameState.LS_HISCORE_KEY, gameState.DEFAULT_HISCORE);
		}
		if (localStorage.getItem(gameState.LS_HILEVEL_KEY) == null) {
			localStorage.setItem(gameState.LS_HILEVEL_KEY, gameState.DEFAULT_HILEVEL);
		}
    }
}
