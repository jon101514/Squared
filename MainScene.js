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
        // Create the player.
        this.makePlayer();
        // Create the UI.
        this.makeUI();
        // Create particle emitter.
        this.makeParticles();
        gameState.cursors = this.input.keyboard.createCursorKeys();
	}

    /**
     * Reset all non-constant values in gameState to their defaults.
     */
    resetData() {
        gameState.lives = 3;
        gameState.level = 1;
        gameState.score = 0;
        gameState.minNumber = 1;
        gameState.maxNumber = 50;
        gameState.expressNum = 5;
        gameState.highScoreReached = false;
        gameState.colorFlavorIndex = 0;
        gameState.currentLevelType = levelType.MULTIPLE;
        gameState.expressionsMode = expressions.OFF;
    }

    /**
     * Only for Level 1, sets the criteria number to be between a specified min/max and also may modify said numbers.
     */
    setupData() {
        gameState.criteriaNum = parseInt((Math.random() * 3) + 2);
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
                // console.log("Number at: (" + x + ", " + y + "): " + newCell.number);
            }
        }
    }

    /**
     * Creates the player and gives them initial grid coordinates gx and gy.
     */
    makePlayer() {
        gameState.player = this.add.sprite(gameState.grid[2][2].x, gameState.grid[2][2].y, 'player');
        // Define the player's grid X and grid Y coordinates
        gameState.player.gx = 2;
        gameState.player.gy = 2;
    }

    /**
     * Create the piece of UI text to display the criteria.
     * PRECONDITION: This is for Level 1, which is always a MULTIPLE stage.
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
        gameState.levelText.setTint(gameState.COLOR_HEXS[gameState.colorFlavorIndex]);
        this.setupLivesDisplay();
    }

    setupLivesDisplay() {
        if (!gameState.livesDisplay) {
            gameState.livesDisplay = [gameState.lives - 1];
        } else {
            console.log("Lives display is: " + gameState.livesDisplay.length);
            for (let i = 0; i < gameState.livesDisplay.length; i++) {
                gameState.livesDisplay[i].destroy();;
            }
        }
        for (let i = 0; i < gameState.lives - 1; i++) {
            gameState.livesDisplay[i] = this.add.sprite(gameState.INIT_X + (i * 32) + 2, 3 * gameState.CENTER_Y / 2, 'life').setOrigin(0.5);
        }
    }

    /**
     * Create the particle and particle emitter for when the player
     * successfully absorbs a number.
     */
    makeParticles() {
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
    }

    /**
     * Reset the entire grid by destroying the text, giving it a new number,
     * and resetting the variables that do with absorption/target number.
     */
    resetGrid() {
        for (let x = 0; x < gameState.GRID_WIDTH; x++) {
            for (let y = 0; y < gameState.GRID_HEIGHT; y++) {
                // gameState.grid[x][y].print.destroy();

                // if (gameState.currentLevelType == levelType.EQUALITY) {
                //     let rand = Math.random();
                //     if (rand < gameState.MIN_GRID_THRESHOLD) {
                //         gameState.grid[x][y].number = gameState.criteriaNum;
                //         gameState.grid[x][y].targetNumber = this.checkTargetNumber(gameState.grid[x][y].number);
                //     } else {
                //         gameState.grid[x][y].number = parseInt((Math.random() * gameState.maxNumber) + gameState.minNumber);
                //         gameState.grid[x][y].targetNumber = this.checkTargetNumber(gameState.grid[x][y].number);
                //     }
                // } else {
                //     gameState.grid[x][y].number = parseInt((Math.random() * gameState.maxNumber) + gameState.minNumber);
                //     gameState.grid[x][y].targetNumber = this.checkTargetNumber(gameState.grid[x][y].number);
                // }


                // gameState.grid[x][y].absorbed = false;
                // // Should the number inside the grid be an expression?
                // switch (gameState.expressionsMode) {
                //     case expressions.ON:
                //         gameState.grid[x][y].printNumber = this.generateExpression(gameState.grid[x][y].number);
                //         gameState.grid[x][y].print = this.add.text(gameState.grid[x][y].x-32, gameState.grid[x][y].y-10, gameState.grid[x][y].printNumber, {
                //             align: "center",
                //             font: gameState.INFO_SMALL_FONT,
                //             fill: '#000000'
                //         });
                //         break;
                //     case expressions.MIXED:
                //     case expressions.OFF:
                //     default:
                //         gameState.grid[x][y].printNumber = gameState.grid[x][y].number.toString();
                //         gameState.grid[x][y].print = this.add.text(gameState.grid[x][y].x-10, gameState.grid[x][y].y-10, gameState.grid[x][y].printNumber, {
                //             align: "center",
                //             font: gameState.INFO_FONT,
                //             fill: '#000000'
                //         });
                //         break;
                // }
                this.resetGridSpace(gameState.grid[x][y]);
            }
        }
        this.checkGridThreshold();
    }

    resetGridSpace(cell, forceTarget = false) {
        cell.print.destroy();

        if (gameState.currentLevelType == levelType.EQUALITY) {
            let rand = Math.random();
            if (rand < gameState.MIN_GRID_THRESHOLD) {
                cell.number = gameState.criteriaNum;
                cell.targetNumber = this.checkTargetNumber(cell.number);
            } else {
                cell.number = parseInt((Math.random() * gameState.maxNumber) + gameState.minNumber);
                cell.targetNumber = this.checkTargetNumber(cell.number);
            }
        } else {
            cell.number = parseInt((Math.random() * gameState.maxNumber) + gameState.minNumber);
            cell.targetNumber = this.checkTargetNumber(cell.number);
        }

        while (forceTarget && !cell.targetNumber) {
            cell.number = parseInt((Math.random() * gameState.maxNumber) + gameState.minNumber);
            cell.targetNumber = this.checkTargetNumber(cell.number);
        }


        cell.absorbed = false;
        // Should the number inside the grid be an expression?
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
        // Reroll the spaces that were non-target.
        if (percent < gameState.MIN_GRID_THRESHOLD) {
            for (let i = 0; i < nons.length; i++) {
                if (Math.random() > 0.5) {
                    this.resetGridSpace(nons[i], true);
                    nonNums--;
                    targNums++;
                }
            }
        }
        console.log("Reroll! results: " + (targNums / (targNums + nonNums)).toString());
    }

    generateExpression(n) {
        // xType: below 1/4 is addition, below 1/2 is subtraction, below 3/4 is multiplication, else, division
        let xType = Math.random(); 
        let flip = Math.random() > 0.5 ? true : false; // coin flip to see if we have a mirrored expression
        let rand = parseInt(Math.random() * gameState.expressNum);
        let result = "";
        if (xType < 1/2) { // Addition, where (rand) + (n - rand) or vice versa
            if (flip) { result = (rand.toString() + ' + ' + (n - rand).toString()); }
            else { result = ((n - rand).toString() + ' + ' + rand.toString()); }
        } else if (xType < 1) { // Subtraction where (n + rand) - (rand)
            result = ((n + rand).toString() + ' - ' + (rand).toString());
        }
        return result;
    }

    /** 
     * Sets the criteria number and updates the text to match.
     */
    setCriteria(min, max, mixmode = false) {
        // gameState.criteriaNum = parseInt((Math.random() * 3) + 2);
        // if (gameState.criteriaText) { // If criteria text already exists...
        //     gameState.criteriaText.setText(`MULTIPLES OF ${gameState.criteriaNum}`);
        // } else { // Otherwise, create it.
        //     gameState.criteriaText = this.add.text(gameState.CENTER_X, gameState.CRITERIA_HEIGHT, `MULTIPLES OF ${gameState.criteriaNum}`, {
        //         font: gameState.INFO_FONT,
        //         fill: '#00ffff'
        //     }).setOrigin(0.5);
        // }
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
	update() {
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
            gameState.score += 10;
            gameState.scoreText.setText(`${gameState.score}`);
            // Play particle FX
            gameState.emitter.explode(8, gameState.player.x, gameState.player.y);
            gridSpace.absorbed = true;
            gridSpace.print.destroy();
            if (this.isLevelComplete()) {
                this.levelUp();
            }
        } else { // Wrong number
            gameState.lives--;
            this.setupLivesDisplay();
            this.screenShake();
            this.gameOverCheck();
        }
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
        gameState.level++;
        let flip = Math.random() > 0.5 ? true : false; // coin flip for some random variety in stage types.
        // Levels have a specific setup range depending on 
        switch(gameState.level) {
            case 2:
                gameState.currentLevelType = levelType.MULTIPLE;
                this.setCriteria(6, 11);
                break;
            case 3:
                gameState.currentLevelType = levelType.FACTOR;
                this.setCriteria(3, 25);
                break;
            case 4:
                gameState.currentLevelType = levelType.MULTIPLE;
                if (flip) { this.setCriteria(2, 2); }
                else { this.setCriteria(5, 5); }
                break;
            case 5:
                if (flip) { 
                    gameState.currentLevelType = levelType.FACTOR 
                    this.setCriteria(10, gameState.maxNumber);
                }
                else { 
                    gameState.currentLevelType = levelType.PRIME; 
                    this.setCriteria(10, gameState.maxNumber); // numbers unused, but still need to update UI
                }
                break;
            case 6:
                if (flip) { 
                    gameState.currentLevelType = levelType.FACTOR 
                    this.setCriteria(6, gameState.maxNumber);
                }
                else { 
                    gameState.currentLevelType = levelType.MULTIPLE; 
                    this.setCriteria(9, 15);
                }
                break;
            case 7:
                if (flip) { gameState.currentLevelType = levelType.EQUALITY }
                else { gameState.currentLevelType = levelType.INEQUALITY; }
                this.setCriteria(1, 10);
                break;
            case 8:
                if (flip) { gameState.currentLevelType = levelType.EQUALITY }
                else { gameState.currentLevelType = levelType.INEQUALITY; }
                this.setCriteria(1, 24);
                break;
            case 9:
                gameState.currentLevelType = levelType.MULTIPLE;
                if (flip) { this.setCriteria(10, 10); }
                else { this.setCriteria(5, 5); }
                break;
            default: // beyond stage 9
                if ((gameState.level - 9) % 5 == 0) { // Type A
                    gameState.currentLevelType = levelType.MULTIPLE;
                    this.setCriteria(9, parseInt(gameState.maxNumber / 3), true);
                } else if ((gameState.level - 9) % 5 == 1) { // Type B
                    if (flip) { gameState.currentLevelType = levelType.EQUALITY }
                    else { gameState.currentLevelType = levelType.INEQUALITY; }
                    this.setCriteria(1, parseInt(gameState.maxNumber / 2), true);
                } else if ((gameState.level - 9) % 5 == 2) { // Type C
                    if (flip) { 
                        gameState.currentLevelType = levelType.FACTOR;
                        this.setCriteria(10, gameState.maxNumber, true); 
                    }
                    else { 
                        gameState.currentLevelType = levelType.PRIME; 
                        this.setCriteria(1, gameState.maxNumber, true); 
                    }
                } else if ((gameState.level - 9) % 5 == 3) { // Type D
                    if (flip) { gameState.currentLevelType = levelType.EQUALITY }
                    else { gameState.currentLevelType = levelType.INEQUALITY; }
                    this.setCriteria(1, gameState.maxNumber, true);
                } else { // Type E
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
        gameState.colorFlavorIndex++;
        gameState.levelText.setText(`LV. ${gameState.level}: ${gameState.FLAVORS[gameState.colorFlavorIndex]}`);
        gameState.levelText.setTint(gameState.COLOR_HEXS[gameState.colorFlavorIndex]);
        this.levelUpDifficulty();
        this.resetGrid();
    }

    /**
     * Make the criteria (usually) more difficulty upon a level up.
     */
    levelUpDifficulty() {
        gameState.maxNumber += 5; // Increase the maximum number found in a cell.
        gameState.expressNum += 4; // Increase how much the expressions can deviate by.
    }

    /**
     * Quickly shake the screen.
     */
    screenShake() {
        this.cameras.main.shake(50, 0.01, true);
    }

    /**
     * If the player's run out of lives, then check for hi scores and load Game Over scene.
     */
    gameOverCheck() {
        if (gameState.lives <= 0) {
            this.hiScoreCheckAndSave();          
            this.cameras.main.fade(gameState.FADE_TIME_FAST, 0, 0, 0, false, function(camera, progress) {
                if (progress >= 1.0) {
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
