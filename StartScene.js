class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScene' })
	}

	create() {
		this.calcCenterCoordinates();
		this.initializeLocalStorage();
		this.add.text( 150, 250, 'Click to start!', {fill: '#ffffff', fontSize: '20px'})
		this.input.on('pointerdown', () => {
			this.scene.stop('StartScene')
			this.scene.start('MainScene')
		})
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
