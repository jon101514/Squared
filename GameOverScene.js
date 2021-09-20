
class GameOverScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOverScene' })
	}

	create() {
		this.add.text( 150, 250, 'GameOverScene!', {fill: '#ffffff', fontSize: '20px'})
		this.input.on('pointerdown', () => {
			this.scene.stop('GameOverScene');
			this.scene.start('StartScene');
		})
	}
}
