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
	}

    /**
     * Calls all the requisite setup functions for the game to make all elements.
     */
	create() {
        // Setup the data for the game.
        this.setupData();
        // Create the grid, with all its numbers.
        this.makeGrid();
        // Create the player.
        this.makePlayer();
        // Create the UI.
        this.makeUI();
        gameState.cursors = this.input.keyboard.createCursorKeys();
	}

    /**
     * Sets the criteria number to a number between 2 and 5.
     */
    setupData() {
        gameState.criteriaNum = parseInt((Math.random() * 3) + 2);
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
                newCell.number = parseInt((Math.random() * 50) + 1); // Number between 1 and 50
                newCell.targetNumber = this.checkTargetNumber(newCell.number); // Whether number is a target number
                newCell.absorbed = false; // Number has not been absorbed yet (since we just created it)
                newCell.printNumber = newCell.number.toString(); // Number as a string.
                gameState.grid[x][y] = newCell; // Add it to the grid.
                newCell.print = this.add.text(newCell.x-9, newCell.y-9, newCell.printNumber, {
                    fontSize: '18px',
                    fill: '#000000'
                });
                // console.log("Number at: (" + x + ", " + y + "): " + newCell.number);
            }
        }
    }

    /**
     * Reset the entire grid by destroying the text, giving it a new number,
     * and resetting the variables that do with absorption/target number.
     */
    resetGrid() {
        for (let x = 0; x < gameState.GRID_WIDTH; x++) {
            for (let y = 0; y < gameState.GRID_HEIGHT; y++) {
                gameState.grid[x][y].print.destroy();
                gameState.grid[x][y].number = parseInt((Math.random() * gameState.maxNumber) + 1);
                gameState.grid[x][y].targetNumber = this.checkTargetNumber(gameState.grid[x][y].number);
                gameState.grid[x][y].absorbed = false;
                gameState.grid[x][y].printNumber = gameState.grid[x][y].number.toString();
                gameState.grid[x][y].print = this.add.text(gameState.grid[x][y].x-9, gameState.grid[x][y].y-9, gameState.grid[x][y].printNumber, {
                    fontSize: '18px',
                    fill: '#000000'
                });
            }
        }
    }

    /** 
     * Sets the criteria number and updates the text to match.
     */
    setCriteria() {
        gameState.criteriaNum = parseInt((Math.random() * 3) + 2);
        if (gameState.criteriaText) { // If criteria text already exists...
            gameState.criteriaText.setText(`Multiples of ${gameState.criteriaNum}`);
        } else { // Otherwise, create it.
            gameState.criteriaText = this.add.text(128, 72, `Multiples of ${gameState.criteriaNum}`, {
                fontSize: '18px',
                fill: '#00ffff'
            });
        }
    }

    /**
     * Create the piece of UI text to display the criteria.
     */
    makeUI() {
        gameState.criteriaText = this.add.text(128, 72, `Multiples of ${gameState.criteriaNum}`, {
            fontSize: '18px',
            fill: '#00ffff'
        });
        gameState.creditsText = this.add.text(256, 700, `Created by Jon So, 2021`, {
            fontSize: '12px',
            fill: '#ffffff'
        });
    }

    /**
     * Helper function that checks if n is a multiple of criteria number.
     * @param {*} n is the number that we're checking against criteria.
     * @returns a boolean whether or not n is a multiple of criteria.
     */
    checkTargetNumber(n) {
        return (n % gameState.criteriaNum == 0);
    }

    /**
     * Processes input by the player for movement and absorbing numbers.
     */
	update() {
		// #TODO: Process game state 
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
            gridSpace.absorbed = true;
            gridSpace.print.destroy();
            if (this.isLevelComplete()) {
                console.log("YOU WIN!");
                this.setCriteria();
                this.resetGrid();
            }
        } else {
            this.setCriteria();
            this.resetGrid();
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
}
