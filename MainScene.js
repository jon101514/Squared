class MainScene extends Phaser.Scene {
	constructor(){
		super({ key: 'MainScene' });
	}

    /**
     * Where we load all the assets for our game.
     */
	preload() {
		// Load the sprites.
        this.load.image('player', 'assets/player.png');
        this.load.image('cell', 'assets/cell.png');
        this.load.image('spark', 'assets/spark.png');
        this.load.image('life', 'assets/life.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('fragment', 'assets/fragments.png');
        this.load.image('line', 'assets/line.png')
        // Load the sound effects.
        this.load.audio('absorb', ['assets/absorb.mp3', 'assets/absorb.ogg']);
        this.load.audio('bullet', ['assets/bullet.mp3', 'assets/bullet.ogg']);
        this.load.audio('extend', ['assets/extend.mp3', 'assets/extend.ogg']);
        this.load.audio('gameover', ['assets/gameover.mp3', 'assets/gameover.ogg']);
        this.load.audio('laser', ['assets/laser.mp3', 'assets/laser.ogg']);
        this.load.audio('levelup', ['assets/levelup.mp3', 'assets/levelup.ogg']);
        this.load.audio('lose', ['assets/lose.mp3', 'assets/lose.ogg']);
        this.load.audio('move', ['assets/move.mp3', 'assets/move.ogg']);
        this.load.audio('ready', ['assets/ready.mp3', 'assets/ready.ogg']);
	}

    /**
     * Calls all the requisite setup functions for the game to make all elements.
     */
	create() {
        // Reset the data to initial values.
        this.resetData();
        // Setup the data for the game.
        this.setupData();
        // Create the grid, with all its numbers.
        this.makeGrid();
        // Set up collisions for bullets/other harmful objects.
        this.setupBullets();
        // Create the player.
        this.makePlayer();
        // Create all audio assets.
        this.makeAudio();
        // Create the UI.
        this.makeUI();
        // Create the timer sprites (horizontal lines to the sides of the board.)
        this.makeTimerSprites();
        // Create particle emitter.
        this.makeParticles();
        gameState.cursors = this.input.keyboard.createCursorKeys(); // Setup taking input.
	}

    /**
     * Reset all non-constant values in gameState to their defaults.
     */
    resetData() {
        gameState.lives = 3;
        gameState.state = states.READY;
        gameState.level = 1;
        gameState.score = 0;
        gameState.toNextBonus = gameState.EVERY_EXTEND;
        gameState.minNumber = 1;
        gameState.maxNumber = 50;
        gameState.expressNum = 5;
        gameState.highScoreReached = false;
        gameState.currentLevelType = levelType.MULTIPLE;
        gameState.expressionsMode = expressions.OFF;
        gameState.colorFlavorIndex = 0;
        gameState.modifierIndex = -1;
        gameState.comboTimer = 0;
        gameState.comboCount = 1;
    }

    /**
     * Only for Level 1, sets the criteria number to be between 3 and 5. 
     */
    setupData() {
        gameState.criteriaNum = parseInt((Math.random() * 3) + 3);
    }

    /**
     * Create the 5x6 grid with each cell given a number, text, and 
     * checks to see if it should be absorbed by the player.
     */
     makeGrid() {
        // Create cells of a grid, store them in a grid, and give them the data that they need.
        gameState.grid = [];
        for (let x = 0; x < gameState.GRID_WIDTH; x++) {
            gameState.grid[x] = [];
            for (let y = 0; y < gameState.GRID_HEIGHT; y++) {
                let newCell = this.add.sprite((x * (gameState.CELL_DIMS + gameState.PADDING)) + gameState.INIT_X, (y * (gameState.CELL_DIMS + gameState.PADDING)) + gameState.INIT_Y, 'cell');
                newCell.number = parseInt((Math.random() * gameState.maxNumber) + gameState.minNumber); // Number between min and maxNumber
                newCell.targetNumber = this.checkTargetNumber(newCell.number); // Whether number is a target number
                newCell.absorbed = false; // Number has not been absorbed yet (since we just created it)
                newCell.printNumber = newCell.number.toString(); // Number as a string.
                gameState.grid[x][y] = newCell; // Add it to the grid.
                newCell.print = this.add.text(newCell.x-10, newCell.y-10, newCell.printNumber, {
                    align: "center",
                    font: gameState.INFO_FONT,
                    fill: '#000000'
                });
            }
        }
    }

    /**
     * Setup the physics group to make a bullet, complete with a resized hitbox example commented.
     */
    setupBullets() {
        gameState.bullets = this.physics.add.group();
        // Give it a small hitbox, too.
        // gameState.bullets.create(132, 194, 'bullet').setSize(2, 2).setOffset(7, 7);
    }

    /**
     * Creates the player and gives them initial grid coordinates gx and gy.
     */
    makePlayer() {
        gameState.player = this.physics.add.sprite(gameState.grid[2][2].x, gameState.grid[2][2].y, 'player');
        // Define the player's grid X and grid Y coordinates
        gameState.player.gx = 2;
        gameState.player.gy = 2;
        // Setup collision data with the player -- if hit during play, lose a life.
        this.physics.add.collider(gameState.player, gameState.bullets, () => {
            if (gameState.state == states.PLAYING) { this.loseLife(); }
        });
    }

    /**
     * Create the pieces of the UI text like the prompt, score, and level counter.
     * PRECONDITION: This is for Level 1, which is always a MULTIPLES stage.
     */
    makeUI() {
        gameState.criteriaText = this.add.text(gameState.CENTER_X, gameState.CRITERIA_HEIGHT, `MULTIPLES OF ${gameState.criteriaNum}`, {
            font: gameState.INFO_FONT,
            fill: '#00ffff'
        }).setOrigin(0.5);
        gameState.creditsText = this.add.text(192, 684, `Created by Jon So, 2021`, {
            font: gameState.DECO_FONT,
            fill: '#ffffff'
        });
        gameState.scoreText = this.add.text(gameState.CENTER_X, gameState.SCORE_HEIGHT, `${gameState.score}`, {
            font: gameState.SCORE_FONT,
            fill: '#ffffff'
        }).setOrigin(0.5);
        gameState.levelText = this.add.text(3 * gameState.CENTER_X / 2, 3 * gameState.CENTER_Y / 2, `LV. ${gameState.level}: ${gameState.FLAVORS[gameState.colorFlavorIndex]}`, {
            font: gameState.INFO_FONT,
            fill: '#ffffff'
        }).setOrigin(0.5);
        gameState.readyPrompt = this.add.text(gameState.CENTER_X, 9 * gameState.CENTER_Y / 16, ``, {
            font: gameState.READY_FONT,
            fill: '#ff0000'
        }).setOrigin(0.5);
        gameState.comboCounterTextLeft = this.add.text(gameState.CENTER_X / 7 + 8, gameState.CENTER_Y - 32, `1x`, {
            font: gameState.COMBO_FONT,
            fill: '#ffffff',
        }).setOrigin(0.5).setFontStyle('bold italic');
        gameState.comboCounterTextRight = this.add.text(config.width - gameState.CENTER_X / 7 - 8, gameState.CENTER_Y - 32, `1x`, {
            font: gameState.COMBO_FONT,
            fill: '#ffffff',
        }).setOrigin(0.5).setFontStyle('bold italic');
        // gameState.timerText = this.add.text(gameState.CENTER_X / 7 + 8, gameState.CENTER_Y - 96, `time`, {
        //     font: gameState.INFO_FONT,
        //     fill: '#00ffff',
        // }).setOrigin(0.5);
        this.showReadyPrompt();
        gameState.levelText.setTint(gameState.COLOR_HEXS[gameState.colorFlavorIndex]);
        this.setupLivesDisplay();
    }

    /**
     * Make static and dynamic sprites that represent the combo timer.
     * The dynamic ones will move from the top to the bottom as the combo timer runs out.
     * When it hits the bottom, start taking from the player's combo count.
     */
    makeTimerSprites() {
        // Static sprites
        gameState.leftTopTimer = this.add.sprite(38, gameState.TOP_OF_GRID_Y, 'line');
        gameState.rightTopTimer = this.add.sprite(config.width - 38, gameState.TOP_OF_GRID_Y, 'line');
        gameState.leftBottomTimer = this.add.sprite(38, gameState.BOTTOM_OF_GRID_Y, 'line');
        gameState.rightBottomTimer = this.add.sprite(config.width - 38, gameState.BOTTOM_OF_GRID_Y, 'line');
        // Moving sprites
        gameState.leftTimerBar = this.add.sprite(38, gameState.TOP_OF_GRID_Y, 'line');
        gameState.rightTimerBar = this.add.sprite(config.width - 38, gameState.TOP_OF_GRID_Y, 'line');
    }

    /**
     * Displays the amount of lives the player has in the bottom-left corner
     * (minus the life they're currently playing, of course.)
     */
    setupLivesDisplay() {
        if (!gameState.livesDisplay) { // If it doesn't exist, make it.
            gameState.livesDisplay = [gameState.lives - 1];
        } else { // Otherwise, clear the lives display array.
            for (let i = 0; i < gameState.livesDisplay.length; i++) {
                gameState.livesDisplay[i].destroy();;
            }
        }
        // Now, create the amount of sprites required (number of lives, minus the one being played)
        for (let i = 0; i < gameState.lives - 1; i++) { 
            gameState.livesDisplay[i] = this.add.sprite(gameState.INIT_X + (i * 32) + 2, 3 * gameState.CENTER_Y / 2, 'life').setOrigin(0.5);
        }
    }

    /**
     * Create the particle and particle emitter for when the player
     * successfully absorbs a number.
     * Also makes the effect for when the player loses.
     */
    makeParticles() {
        // Absorb particles
        gameState.particles = this.add.particles('spark');
        gameState.emitter = gameState.particles.createEmitter({ 	
            x: gameState.player.x,
            y: gameState.player.y,
            lifespan: 256,
            speedX: {min: -512, max: 512},
            speedY: {min: -512, max: 512},
            scale: {start: 4, end: 0},
            tint: [0xff00ff, 0x00ffff],
            quantity: 8,
            blendMode: 'ADD'
        }); 
        gameState.emitter.explode(0, gameState.player.x, gameState.player.y);
        // Lose Particles
        gameState.loseParticles = this.add.particles('fragment');
        gameState.loseEmitter = gameState.loseParticles.createEmitter({
            x: gameState.player.x,
            y: gameState.player.y,
            lifespan: 1024,
            speedX: {min: -128, max: 128},
            speedY: {min: -128, max: 128},
            scale: {start: 1.5, end: 0},
            quantity: 16,
            rotate: () => { return Math.random() * 360},
            onUpdate: (particle) => { return particle.angle + 1},
            blendMode: 'NORMAL'
        });
        gameState.loseEmitter.explode(0, gameState.player.x, gameState.player.y);
    }

    /**
     * Add all of the sound effects to the sfx object.
     */
    makeAudio() {
        sfx.absorb = this.sound.add('absorb');
        sfx.bullet = this.sound.add('bullet');
        sfx.extend = this.sound.add('extend');
        sfx.gameover = this.sound.add('gameover');
        sfx.levelup = this.sound.add('levelup');
        sfx.laser = this.sound.add('laser');
        sfx.lose = this.sound.add('lose');
        sfx.move = this.sound.add('move');
        sfx.ready = this.sound.add('ready');
    }

    /**
     * Reset the entire grid by destroying the text, giving it a new number,
     * and resetting the variables that do with absorption/target number.
     */
    resetGrid() {
        for (let x = 0; x < gameState.GRID_WIDTH; x++) {
            for (let y = 0; y < gameState.GRID_HEIGHT; y++) {
                this.resetGridSpace(gameState.grid[x][y]);
            }
        }
        this.checkGridThreshold();
    }

    /**
     * Given a cell in the grid, sets the number inside it as well as its text representation.
     * @param {*} cell: A space in the grid from gameState.grid[x][y].
     * @param {*} forceTarget (optional) Force the number in the cell we're generating to be a target number.
     */
    resetGridSpace(cell, forceTarget = false) {
        cell.print.destroy();

        // Force EQUALITY and INEQUALITY levels to have a certain amount of target numbers.
        if (gameState.currentLevelType == levelType.EQUALITY) {
            let rand = Math.random();
            if (rand < gameState.MIN_GRID_THRESHOLD) {
                cell.number = gameState.criteriaNum;
                cell.targetNumber = this.checkTargetNumber(cell.number);
            } else {
                cell.number = parseInt((Math.random() * gameState.maxNumber) + gameState.minNumber);
                cell.targetNumber = this.checkTargetNumber(cell.number);
            }
        } else if (gameState.currentLevelType == levelType.INEQUALITY) {
            let rand = Math.random();
            if (rand > gameState.MIN_GRID_THRESHOLD) { // The trick here is that criteriaNum should be avoided.
                cell.number = gameState.criteriaNum;
                cell.targetNumber = this.checkTargetNumber(cell.number);
            } else {
                cell.number = parseInt((Math.random() * gameState.maxNumber) + gameState.minNumber);
                cell.targetNumber = this.checkTargetNumber(cell.number);
            }
        } else { // For all other stages, just generate the number.
            cell.number = parseInt((Math.random() * gameState.maxNumber) + gameState.minNumber);
            cell.targetNumber = this.checkTargetNumber(cell.number);
        }
        // If we need to force it to be a target, then keep rerolling until it's a targetNumber.
        while (forceTarget && !cell.targetNumber) {
            cell.number = parseInt((Math.random() * gameState.maxNumber) + gameState.minNumber);
            cell.targetNumber = this.checkTargetNumber(cell.number);
        }

        cell.absorbed = false;
        // Should the number inside the grid be an expression? 3 Modes: ON, MIXED, and OFF
        switch (gameState.expressionsMode) {
            case expressions.ON:
                cell.printNumber = this.generateExpression(cell.number);
                cell.print = this.add.text(cell.x-32, cell.y-10, cell.printNumber, {
                    align: "center",
                    font: gameState.INFO_SMALL_FONT,
                    fill: '#000000'
                });
                break;
            case expressions.MIXED:
                let flip = Math.random() > 0.5 ? true : false; // coin flip 
                if (flip) { // Give an expression.
                    cell.printNumber = this.generateExpression(cell.number);
                    cell.print = this.add.text(cell.x-32, cell.y-10, cell.printNumber, {
                        align: "center",
                        font: gameState.INFO_SMALL_FONT,
                        fill: '#000000'
                    });
                    break;
                } // otherwise, it'll fall thru to the 'off' case.
            case expressions.OFF:
            default:
                cell.printNumber = cell.number.toString();
                cell.print = this.add.text(cell.x-10, cell.y-10, cell.printNumber, {
                    align: "center",
                    font: gameState.INFO_FONT,
                    fill: '#000000'
                });
                break;
        }
    }

    /**
     * A helper function that calculates the percent of targetNums on the board.
     * If it's below 20%, then reroll a percent of the non-target spaces to become targetNums.
     */
    checkGridThreshold() {
        let targNums = 0; // amount of target numbers
        let nonNums = 0; // amount of non-target numbers
        let nons = [];
        for (let x = 0; x < gameState.GRID_WIDTH; x++) {
            for (let y = 0; y < gameState.GRID_HEIGHT; y++) {
                let current = gameState.grid[x][y];
                if (current.targetNumber) { targNums++; }
                else { 
                    nons[nonNums] = gameState.grid[x][y];
                    nonNums++; 
                }
            }
        }
        console.log("checkGridThreshold results: " + (targNums / (targNums + nonNums)).toString());
        let percent = (targNums / (targNums + nonNums));
        // Reroll a percentage of the spaces that were non-target.
        while (percent < gameState.MIN_GRID_THRESHOLD) {
            for (let i = 0; i < nons.length; i++) {
                if (Math.random() < gameState.REROLL_PERCENT) {
                    this.resetGridSpace(nons[i], true);
                    nonNums--;
                    targNums++;
                }
            }
            percent = (targNums / (targNums + nonNums))
            console.log("Reroll! results: " + (targNums / (targNums + nonNums)).toString());
        }
    }

    /**
     * Generates either an addition or subtraction expression that equals the number given as parameter.
     * @param {Number} n: The number that the expression eventually evaluates to.
     * @returns A string expression that, when evaluated, becomes the number n.
     */
    generateExpression(n) {
        // xType: below 1/2 is addition, above 1/2 is subtraction
        let xType = Math.random(); 
        let flip = Math.random() > 0.5 ? true : false; // coin flip to see if we have a mirrored expression
        let rand = parseInt(Math.random() * gameState.expressNum);
        let result = "";
        if (xType < 1/2) { // Addition, where (rand) + (n - rand) or vice versa
            if (flip) { result = (rand.toString() + ' + ' + (n - rand).toString()); }
            else { result = ((n - rand).toString() + ' + ' + rand.toString()); }
        } else { // Subtraction where (n + rand) - (rand)
            result = ((n + rand).toString() + ' - ' + (rand).toString());
        }
        return result;
    }

    /** 
     * Sets the criteria number and updates the text to match.
     */
    setCriteria(min, max, mixmode = false) {
        switch (gameState.currentLevelType) {
            case levelType.MULTIPLE:
                gameState.expressionsMode = expressions.OFF;
                gameState.criteriaNum = parseInt((Math.random() * (max - min)) + min);
                gameState.criteriaText.setText(`MULTIPLES OF ${gameState.criteriaNum}`);
                break;
            case levelType.FACTOR:
                gameState.expressionsMode = expressions.OFF;
                gameState.criteriaNum = parseInt((Math.random() * (max - min)) + min);
                gameState.criteriaText.setText(`FACTORS OF ${gameState.criteriaNum}`);
                break;
            case levelType.PRIME:
                gameState.minNumber = 1;
                gameState.expressionsMode = expressions.OFF;
                gameState.criteriaText.setText(`PRIME NUMBERS`);
                break;
            case levelType.EQUALITY:
                gameState.expressionsMode = expressions.ON;
                gameState.criteriaNum = parseInt((Math.random() * (max - min)) + min);
                gameState.criteriaText.setText(`EQUAL TO ${gameState.criteriaNum}`);
                break;
            case levelType.INEQUALITY:
                gameState.expressionsMode = expressions.ON;
                gameState.criteriaNum = parseInt((Math.random() * (max - min)) + min);
                gameState.criteriaText.setText(`NOT EQUAL TO ${gameState.criteriaNum}`);
                break;
            default:
                break;
        }
        if (mixmode) { gameState.expressionsMode = expressions.MIXED; }
    }

    /**
     * Helper function that checks if n satisfies a certain criteria number.
     * @param {*} n is the number that we're checking against criteria.
     * @returns a boolean whether or not n satisfies of criteria.
     */
    checkTargetNumber(n) {
        // return (n % gameState.criteriaNum == 0);
        switch (gameState.currentLevelType) {
            case levelType.MULTIPLE: // criteriaNum multiplied by an integer is n.
                return (n % gameState.criteriaNum == 0);
            case levelType.FACTOR: // n is a multiple of criteriaNum.
                return (gameState.criteriaNum % n == 0);
            case levelType.PRIME: // n is a prime number.
                // Count from 1 to n and make sure n's only factors are 1 and n.
                for (let i = 1; i < n; i++) {
                    if (n % i == 0 && i != 1) {
                        return false;
                    }
                }
                return true;
            case levelType.EQUALITY:
                return n == gameState.criteriaNum;
            case levelType.INEQUALITY:
                return n != gameState.criteriaNum;
            default:
                console.log("ERROR: checkTargetNumber(" + n + ") has no currentLevelType defined! currentLevelType: " + gameState.currentLevelType);
                return false;
        }
    }

    /**
     * Processes input by the player for movement and absorbing numbers.
     */
	update(timestep, dt) {
        if (gameState.state == states.PLAYING) {
            // Process input.
            if (Phaser.Input.Keyboard.JustDown(gameState.cursors.up)) {
                this.playerMove(8);
            } else if (Phaser.Input.Keyboard.JustDown(gameState.cursors.down)) {
                this.playerMove(2);
            } else if (Phaser.Input.Keyboard.JustDown(gameState.cursors.left)) {
                this.playerMove(4);
            } else if (Phaser.Input.Keyboard.JustDown(gameState.cursors.right)) {
                this.playerMove(6);
            } else if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space)) {
                this.absorbNumber();
            }
            else if (Phaser.Input.Keyboard.JustDown(gameState.cursors.shift)) {
                console.log("DEBUG: Level Up!");
                this.levelUp();
            }
            // Process the combo timer/counter.
            this.processComboSystem(this.sys.game.loop.deltaHistory[9]);
            // console.log("time: " + this.sys.game.loop.time.toString());
            // console.log("delta: " + this.sys.game.loop.deltaHistory.toString());
        }        
	}

    /**
     * Handles the combo timer/counter system on a timed basis.
     * This entails subtracting the appropriate amount of time from combo timer
     * and, if the combo timer is out, then decrease the player's combo count.
     * @param {Number} deltaTime - the amount of time that's passed from the previous frame, in ms.
     */
    processComboSystem(deltaTime) {
        // Decrease the combo timer.
        if (gameState.comboTimer > 0) {
            gameState.comboTimer -= deltaTime;
            // gameState.timerText.setText(gameState.comboTimer.toString());
            // Update the positions of the timer bar.
            gameState.leftTimerBar.y = this.lerp(gameState.BOTTOM_OF_GRID_Y, gameState.TOP_OF_GRID_Y, gameState.comboTimer / gameState.COMBO_TIMER_MAX);
            gameState.rightTimerBar.y = this.lerp(gameState.BOTTOM_OF_GRID_Y, gameState.TOP_OF_GRID_Y, gameState.comboTimer / gameState.COMBO_TIMER_MAX);
        } else { // Decrease the combo count.
            // console.log("Deplete Event: " + gameState.depleteEvent);
            if (!gameState.depleteEvent) {
                gameState.depleteEvent = this.time.addEvent({
                    callback: () => {
                        if (gameState.comboCount > 1) { 
                            // console.log("DEPLETED!");
                            this.setComboCount(gameState.comboCount - 1);
                        }
                    },
                    delay: gameState.COMBO_COUNTER_DEPLETE_TIME,
                    callbackScope: this,
                    loop: true
                });
            }
        }
    }

    lerp(a, b, t) {
        if (t < 0) { t = 0; }
        else if (t > 1) { t = 1; }
        return (1 - t) * a + t * b;
    }

    /**
     * Moves the player in one of the four cardinal directions on the grid.
     * @param {*} direction - numpad notation for the direction to move. 8, 2, 4, or 6.
     */
    playerMove(direction) {
        switch(direction) {
            case 8: // UP
                if (gameState.player.gy > 0) { // If in bounds...
                    gameState.player.gy--;
                    gameState.player.y = gameState.grid[gameState.player.gx][gameState.player.gy].y;
                }
                break;
            case 2: // DOWN
                if (gameState.player.gy < gameState.GRID_HEIGHT - 1) { // If in bounds...
                    gameState.player.gy++;
                    gameState.player.y = gameState.grid[gameState.player.gx][gameState.player.gy].y;
                }
                break;
            case 4: // LEFT
                if (gameState.player.gx > 0) { // If in bounds...
                    gameState.player.gx--;
                    gameState.player.x = gameState.grid[gameState.player.gx][gameState.player.gy].x;
                }
                break;
            case 6: // RIGHT
                if (gameState.player.gx < gameState.GRID_WIDTH - 1) { // If in bounds...
                    gameState.player.gx++;
                    gameState.player.x = gameState.grid[gameState.player.gx][gameState.player.gy].x;
                }
                break;
            default:
                break;
        }
        sfx.move.play();
    }

    /**
     * Reads the number the player is currently on and if it is a targetNumber
     * (it fulfils the criteria), then absorb it. Otherwise, reset the board.
     * Also, if the player has completed the level, reset the board.
     */
    absorbNumber() {
        let gridSpace = gameState.grid[gameState.player.gx][gameState.player.gy];
        if (gridSpace.targetNumber) {
            // Don't do anything if number's already been absorbed
            if (gridSpace.absorbed) { return; }
            // Otherwise, continue... 
            sfx.absorb.play();
            // Scoring System updates:

            gameState.comboTimer = gameState.COMBO_TIMER_MAX; // reset timer
            // stop depleting the combo counter
            if (gameState.depleteEvent != null) { 
                gameState.depleteEvent.destroy(); 
                gameState.depleteEvent = null;
            } 
            
            this.setComboCount(gameState.comboCount + 1);
            
            gameState.score += gameState.BASE_SCORE * (gameState.comboCount);
            gameState.scoreText.setText(`${gameState.score}`);

            // Check for extends
            if (gameState.score >= gameState.toNextBonus) { // They got it!
                sfx.extend.play();
                gameState.lives++;
                this.setupLivesDisplay();
                gameState.toNextBonus += gameState.EVERY_EXTEND; // Up the amount of points they need.
            }

            // Play particle FX
            gameState.emitter.explode(8, gameState.player.x, gameState.player.y);
            gridSpace.absorbed = true;
            gridSpace.print.destroy();
            if (this.isLevelComplete()) {
                this.levelUp();
            }
        } else { // Wrong number
            this.loseLife();
        }
    }

    /**
     * Sets the combo counter to a new value and then updates the UI.
     * @param {Number} newCount - the new value of the combo counter.
     */
    setComboCount(newCount) {
        gameState.comboCount = newCount;
        gameState.comboCounterTextLeft.setText(gameState.comboCount + "x");
        gameState.comboCounterTextRight.setText(gameState.comboCount + "x");
    }

    /**
     * When the player has absorbed the wrong number or has been hit,
     * subtract a life, give the player a bit of pause, and resume play.
     */
    loseLife() {
        // Drop the combo.
        this.setComboCount(1);

        gameState.lives--;
        gameState.state = states.LOSING;
        sfx.lose.play();
        gameState.loseEmitter.explode(16, gameState.player.x, gameState.player.y);
        this.setupLivesDisplay();
        this.screenShake();
        this.gameOverCheck();
        // Shrink the player
        gameState.player.shrink = this.tweens.add({
            targets: gameState.player, // what the tween affects
            scaleX: 0,
            scaleY: 0,
            rotation: () => { return gameState.player.angle + 15; },
            ease: 'Linear', // easing function, like bouncing
            duration: gameState.LOSE_TIME, // length in ms
            repeat: 0, // -1 for infinite, +n for finite
            yoyo: true // play the tween in reverse once at end
        });
        // gameState.player.shrink.play();
        this.time.addEvent({
            callback: this.showReadyPrompt,
            delay: gameState.LOSE_TIME,
            callbackScope: this,
            loop: false
        });
    }

    showReadyPrompt() {
        console.log("restoreLife");
        sfx.ready.play();
        gameState.readyPrompt.setText("READY!");

        gameState.state = states.READY;
        this.time.addEvent({
            callback: this.setBackToPlaying,
            delay: gameState.LOSE_TIME,
            callbackScope: this,
            loop: false
        });
    }

    setBackToPlaying() {
        gameState.readyPrompt.setText("");
        gameState.state = states.PLAYING;
    }

    /**
     * Checks to see if there are any more targetNumbers left to absorb on the grid.
     * @returns a bool saying whether or not the level is complete.
     */
    isLevelComplete() {
        let gridSpace;
        for (let x = 0; x < gameState.GRID_WIDTH; x++) {
            for (let y = 0; y < gameState.GRID_HEIGHT; y++) {
                gridSpace = gameState.grid[x][y];
                if (gridSpace.targetNumber && !gridSpace.absorbed) {
                    console.log("Get the " + gridSpace.number + " at (" + x + ", " + y + ")");
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Increase the level, update the UI, and set a new criteria/grid.
     */
     levelUp() {
         // Have a bit of a pause so that the player can notice the new criteria up top.
        this.showReadyPrompt();
        sfx.levelup.play();
        gameState.level++;
        let flip = Math.random() > 0.5 ? true : false; // coin flip for some random variety in stage types.
        // Levels have a specific setup, with some having randomization (e.g. inequality/equality)
        switch(gameState.level) {
            case 2: // Multiples 6-11
                gameState.currentLevelType = levelType.MULTIPLE;
                this.setCriteria(6, 11);
                break;
            case 3: // Factors 3-25
                gameState.currentLevelType = levelType.FACTOR;
                this.setCriteria(3, 25);
                break;
            case 4: // Breather level, X2 or X5
                gameState.currentLevelType = levelType.MULTIPLE;
                if (flip) { this.setCriteria(2, 2); }
                else { this.setCriteria(5, 5); }
                break;
            case 5: // Either Factors 10-M or Primes 
                if (flip) { 
                    gameState.currentLevelType = levelType.FACTOR 
                    this.setCriteria(10, gameState.maxNumber);
                }
                else { 
                    gameState.currentLevelType = levelType.PRIME; 
                    this.setCriteria(10, gameState.maxNumber); // numbers unused, but still need to update UI
                }
                break;
            case 6: // FActors 6-Max or Multiples 9-15
                if (flip) { 
                    gameState.currentLevelType = levelType.FACTOR 
                    this.setCriteria(6, gameState.maxNumber);
                }
                else { 
                    gameState.currentLevelType = levelType.MULTIPLE; 
                    this.setCriteria(9, 15);
                }
                break;
            case 7: // (in)equality 1-10
                if (flip) { gameState.currentLevelType = levelType.EQUALITY }
                else { gameState.currentLevelType = levelType.INEQUALITY; }
                this.setCriteria(1, 10);
                break;
            case 8:// (in)equality 1-24
                if (flip) { gameState.currentLevelType = levelType.EQUALITY }
                else { gameState.currentLevelType = levelType.INEQUALITY; }
                this.setCriteria(1, 24);
                break;
            case 9: // Breather level, X10 or X5
                gameState.currentLevelType = levelType.MULTIPLE;
                if (flip) { this.setCriteria(10, 10); }
                else { this.setCriteria(5, 5); }
                break;
            default: // beyond stage 9
                if ((gameState.level - 9) % 5 == 0) { // Type A: Multiples 9-(M/3)
                    gameState.currentLevelType = levelType.MULTIPLE;
                    this.setCriteria(9, parseInt(gameState.maxNumber / 3), true);
                } else if ((gameState.level - 9) % 5 == 1) { // Type B: (in)equality from 1-(M/2)
                    if (flip) { gameState.currentLevelType = levelType.EQUALITY }
                    else { gameState.currentLevelType = levelType.INEQUALITY; }
                    this.setCriteria(1, parseInt(gameState.maxNumber / 2), true);
                } else if ((gameState.level - 9) % 5 == 2) { // Type C: either Factors 10-M or Primes 1-M
                    if (flip) { 
                        gameState.currentLevelType = levelType.FACTOR;
                        this.setCriteria(10, gameState.maxNumber, true); 
                    }
                    else { 
                        gameState.currentLevelType = levelType.PRIME; 
                        this.setCriteria(1, gameState.maxNumber, true); 
                    }
                } else if ((gameState.level - 9) % 5 == 3) { // Type D: (in)equality from 1-M
                    if (flip) { gameState.currentLevelType = levelType.EQUALITY }
                    else { gameState.currentLevelType = levelType.INEQUALITY; }
                    this.setCriteria(1, gameState.maxNumber, true);
                } else { // Type E: Breather level, X10, X15, X20, or X25
                    gameState.currentLevelType = levelType.MULTIPLE;
                    let rand = Math.random();
                    if (rand < 1/4) { this.setCriteria(10, 10, true) }
                    else if (rand < 2/4) { this.setCriteria(15, 15, true) }
                    else if (rand < 3/4) { this.setCriteria(20, 20, true) }
                    else { this.setCriteria(25, 25, true); }
                }
                break;
        }
        console.log("Level Up to " + gameState.level + "! gameSTate.currentLevelType: " + gameState.currentLevelType);
        // Keeping both colorFlavor and modifier indices in bounds (Modifiers show up after exhausting all flavors; start back at vanilla.)
        gameState.colorFlavorIndex++;
        if (gameState.colorFlavorIndex > gameState.FLAVORS.length - 1) {
            gameState.colorFlavorIndex = 0;
            if (gameState.modifierIndex < gameState.MODIFIERS.length - 1) { gameState.modifierIndex++;} 
        } 
        if (gameState.modifierIndex >= 0) { // Print level name with modifier. We start the mod at -1 to avoid printing it the first go-around.
            gameState.levelText.setText(`LV. ${gameState.level}: ${gameState.MODIFIERS[gameState.modifierIndex]} ${gameState.FLAVORS[gameState.colorFlavorIndex]}`);
        } else { // Without modifier.
            gameState.levelText.setText(`LV. ${gameState.level}: ${gameState.FLAVORS[gameState.colorFlavorIndex]}`);
        }
        
        gameState.levelText.setTint(gameState.COLOR_HEXS[gameState.colorFlavorIndex]);
        this.levelUpDifficulty();
        this.resetGrid();
    }

    /**
     * Increase the range on maxNumber and expressNum.
     */
    levelUpDifficulty() {
        if (gameState.maxNumber < 900) {
            gameState.maxNumber += 5; // Increase the maximum number found in a cell.
        }
        if (gameState.expressNum < 100) {
            gameState.expressNum += 4; // Increase how much the expressions can deviate by.
        }
    }

    /**
     * Quickly shake the screen.
     */
    screenShake() {
        this.cameras.main.shake(192, 0.01, true);
    }

    /**
     * If the player's run out of lives, then check for hi scores and load Game Over scene.
     */
    gameOverCheck() {
        if (gameState.lives <= 0) {
            this.hiScoreCheckAndSave();          
            this.cameras.main.fade(gameState.FADE_TIME_FAST, 0, 0, 0, false, function(camera, progress) {
                if (progress >= 1.0) {
                    sfx.gameover.play();
                    this.scene.stop('MainScene');
			        this.scene.start('GameOverScene');
                }
            });
        }
    }

    /**
     * Checks to see if the player has reached a high score, and if so,
     * save their high score and highest level (and set a bool to tell 
     * GameOverScene that a high score has been reached.)
     */
    hiScoreCheckAndSave() {
        if (gameState.score > localStorage.getItem(gameState.LS_HISCORE_KEY)) {
            localStorage.setItem(gameState.LS_HISCORE_KEY, gameState.score);
            gameState.highScoreReached = true;
        }
        if (gameState.level > localStorage.getItem(gameState.LS_HILEVEL_KEY)) {
            localStorage.setItem(gameState.LS_HILEVEL_KEY, gameState.level);
        }
    }
}
