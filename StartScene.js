class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScene' })
	}

	/**
	 * Preload all of the assets like sounds and sprites.
	 */
	preload() {
		this.load.image('logo', 'assets/logo.png');
		this.load.image('tutorial1', 'assets/tutorial1.png');
		this.load.image('tutorial2', 'assets/tutorial2.png');
		this.load.image('tutorial3', 'assets/tutorial3.png');
		this.load.image('life', 'assets/life.png');
		this.load.image('spark', 'assets/spark.png');
		this.load.audio('ui', ['assets/ui.mp3', 'assets/ui.ogg']);
	}

	/**
	 * Setup the center of the screen as well as initialization of hi scores,
	 * then create a logo, credits, and start prompt. Also create hidden elements 
	 * to display later as the tutorial.
	 */
	create() {
		// setup
		sfx.ui = this.sound.add('ui');
		this.calcCenterCoordinates();
		this.initializeLocalStorage();
		// add resources
		this.add.image(gameState.CENTER_X, gameState.CENTER_Y / 2, 'logo').setOrigin(0.5);
		this.add.text(gameState.CENTER_X, gameState.CENTER_Y, `ARROWS TO MOVE | SPACE TO ABSORB`, {
			font: gameState.INFO_FONT,
            fill: '#00ffff'
        }).setOrigin(0.5);
		// Some appealing particle effects for the title screen, emitting from the player icon
		gameState.life = this.add.image(gameState.CENTER_X, 10 * gameState.CENTER_Y / 8, 'life').setOrigin(0.5);
		gameState.particles = this.add.particles('spark');
        gameState.emitter = gameState.particles.createEmitter({ 	
            x: gameState.life.x,
            y: gameState.life.y,
            lifespan: 256,
            speedX: {min: -512, max: 512},
            speedY: {min: -512, max: 512},
            scale: {start: 3, end: 0},
            tint: [0xff00ff, 0x00ffff],
            quantity: 1,
            blendMode: 'ADD'
        }); 
		// Start prompt
		this.add.text(gameState.CENTER_X, 3 * gameState.CENTER_Y / 2, `SPACE TO START`, {
			font: gameState.INFO_FONT,
            fill: '#00ffff'
        }).setOrigin(0.5);
		gameState.creditsText = this.add.text(192, 684, `Created by Jon So, 2021`, {
            font: gameState.DECO_FONT,
            fill: '#ffffff'
        });
		gameState.cursors = this.input.keyboard.createCursorKeys(); // To take input to start
		// Create the tutorial graphics -- and turn them off
		gameState.tutorial1 = this.add.sprite(0, 0, 'tutorial1').setOrigin(0);
		gameState.tutorial1.visible = false;
		gameState.tutorial2 = this.add.sprite(0, 0, 'tutorial2').setOrigin(0);
		gameState.tutorial2.visible = false;
		gameState.tutorial3 = this.add.sprite(0, 0, 'tutorial3').setOrigin(0);
		gameState.tutorial3.visible = false;
		gameState.tutorialText = this.add.text(gameState.CENTER_X, 136, ``, {
            font: gameState.DECO_FONT,
            fill: '#ffffff'
        }).setOrigin(0.5).setTint(0x00ff00);
		// Start the tutorial after a certain time
		this.time.addEvent({
            callback: this.showTutorial1,
            delay: 4000,
            callbackScope: this,
            loop: false
        });
	}

	/**
	 * The following functions display different "slides" for the tutorial
	 * on a timed loop, ending by going back to the title screen then repeating.
	 */
	showTutorial1() {
		gameState.tutorial1.visible = true;
		gameState.tutorialText.setText("Arrow keys to move,\nSpace to absorb numbers");
		this.time.addEvent({
            callback: this.showTutorial2,
            delay: 3000,
            callbackScope: this,
            loop: false
        });
	}

	showTutorial2() {
		gameState.tutorial1.visible = false;
		gameState.tutorial2.visible = true;
		gameState.tutorialText.setText("Absorb all numbers\nsatisfying this criteria");
		gameState.tutorialText.y = 136;
		this.time.addEvent({
            callback: this.showTutorial3,
            delay: 3000,
            callbackScope: this,
            loop: false
        });
	}

	showTutorial3() {
		gameState.tutorial2.visible = false;
		gameState.tutorial3.visible = true;
		gameState.tutorialText.setText("Do not absorb other numbers");
		gameState.tutorialText.setTint(0xff006e);
		gameState.tutorialText.y = 524;
		this.time.addEvent({
            callback: this.showTutorial4,
            delay: 3000,
            callbackScope: this,
            loop: false
        });
	}

	showTutorial4() {
		gameState.tutorial1.visible = true;
		gameState.tutorial3.visible = false;
		gameState.tutorialText.setText("Extra tries every " + gameState.EVERY_EXTEND + " points");
		gameState.tutorialText.setTint(0x00ff00);
		gameState.tutorialText.y = 524;
		this.time.addEvent({
            callback: this.showTutorial5,
            delay: 2000,
            callbackScope: this,
            loop: false
        });
	}

	showTutorial5() {
		gameState.tutorialText.setText("Play quickly to build a combo\nand earn a high score!");
		gameState.tutorialText.y = 524;
		this.time.addEvent({
            callback: this.endTutorial,
            delay: 2000,
            callbackScope: this,
            loop: false
        });
	}

	endTutorial() {
		gameState.tutorial1.visible = false;
		gameState.tutorial2.visible = false;
		gameState.tutorial3.visible = false;
		gameState.tutorialText.setText(``);
		gameState.tutorialText.y = 136;
		this.time.addEvent({
            callback: this.showTutorial1,
            delay: 4000,
            callbackScope: this,
            loop: false
        });
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
