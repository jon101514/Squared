
class GameOverScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOverScene' })
	}

	/**
	 * Preload the sound effect for transferring to another scene.
	 */
	preload() {
		this.load.audio('ui', ['assets/ui.mp3', 'assets/ui.ogg']);
	}

	/**
	 * Create a Game Over message, display the player's score/level,
	 * display the highest score and highest level, a special animation
	 * if the player has reached the high score, and a prompt to go back to 
	 * title or play again.
	 */
	create() {
		sfx.ui = this.sound.add('ui');
		// Special effects if player got high score
		if (gameState.highComboReached || gameState.highLevelReached || gameState.highScoreReached) {
			this.makeParticles();
			if (gameState.highScoreReached) {
				this.add.text(gameState.CENTER_X, gameState.CENTER_Y / 2, `You got a High Score!`, {
					font: gameState.DECO_FONT,
					fill: '#00ffff'
				}).setOrigin(0.5);
			} 
			if (gameState.highComboReached) {
				this.add.text(gameState.CENTER_X, gameState.CENTER_Y / 2 + 24, `You got the Highest Combo!`, {
					font: gameState.DECO_FONT,
					fill: '#00ffff'
				}).setOrigin(0.5);
			} 
			if (gameState.highLevelReached) {
				this.add.text(gameState.CENTER_X, gameState.CENTER_Y / 2 + 48, `You reached the Highest Level!`, {
					font: gameState.DECO_FONT,
					fill: '#00ffff'
				}).setOrigin(0.5);
			}
		} else {
			this.add.text(gameState.CENTER_X, gameState.CENTER_Y / 2, `Game Over`, {
				font: gameState.DECO_FONT,
				fill: '#00ffff'
			}).setOrigin(0.5);
		}
		// Player Data
		this.add.text(gameState.CENTER_X / 2, gameState.CENTER_Y, `SCORE: ${gameState.score}`, {
            font: gameState.INFO_FONT,
            fill: '#ffffff'
        }).setOrigin(0.5);
		this.add.text(3 * gameState.CENTER_X / 2, gameState.CENTER_Y, `LEVEL: ${gameState.level}`, {
            font: gameState.INFO_FONT,
            fill: '#ffffff'
        }).setOrigin(0.5);
		
		// High Score Data
		this.add.text(gameState.CENTER_X / 2, gameState.CENTER_Y + 24, `HI SCORE: ${localStorage.getItem(gameState.LS_HISCORE_KEY)}`, {
            font: gameState.INFO_FONT,
            fill: '#ffffff'
        }).setOrigin(0.5);
		this.add.text(3 * gameState.CENTER_X / 2, gameState.CENTER_Y + 24, `HI LEVEL: ${localStorage.getItem(gameState.LS_HILEVEL_KEY)}`, {
            font: gameState.INFO_FONT,
            fill: '#ffffff'
        }).setOrigin(0.5);
		// Highest combo data
		this.add.text(gameState.CENTER_X, gameState.CENTER_Y + 72, `COMBO: ${gameState.bestCombo}`, {
            font: gameState.INFO_FONT,
            fill: '#ffffff'
        }).setOrigin(0.5);
		this.add.text(gameState.CENTER_X, gameState.CENTER_Y + 96, `HI COMBO: ${localStorage.getItem(gameState.LS_HICOMBO_KEY)}`, {
            font: gameState.INFO_FONT,
            fill: '#ffffff'
        }).setOrigin(0.5);
		// Prompt to go back to title screen or play again
		this.add.text(gameState.CENTER_X, 3 * gameState.CENTER_Y / 2, `Space to Play Again\nClick to go back to Start`, {
            font: gameState.INFO_FONT,
            fill: '#ffffff'
        }).setOrigin(0.5);
		// Setup event to go back to Start
		this.input.on('pointerdown', () => {
			sfx.ui.play();
			this.cameras.main.fade(gameState.FADE_TIME_SLOW, 0, 0, 0, false, function(camera, progress) {
                if (progress >= 1.0) {
                    this.scene.stop('GameOverScene');
			        this.scene.start('StartScene');
                }
            });
		});
		// And setup cursors to play again
		gameState.cursors = this.input.keyboard.createCursorKeys();
	}

	/**
	 * Handle pressing space to play again.
	 */
	update() {
		if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space)) {
			sfx.ui.play();
            this.cameras.main.fade(gameState.FADE_TIME_FAST, 0, 0, 0, false, function(camera, progress) {
                if (progress >= 1.0) {
                    this.scene.stop('GameOverScene');
			        this.scene.start('MainScene');
                }
            });
        }
	}

	/**
     * Create the particle and particle emitter for when the player
     * successfully absorbs a number.
     */
	 makeParticles() {
        gameState.particles = this.add.particles('spark');
        gameState.emitter = gameState.particles.createEmitter({ 	
            x: gameState.CENTER_X,
            y: -24,
            lifespan: 4096,
            speedX: {min: -512, max: 512},
            speedY: {min: 0, max: 512},
            scale: {start: 2, end: 0},
            tint: [0xff00ff, 0x00ffff],
            quantity: 1,
            blendMode: 'ADD'
        }); 
    }
}
