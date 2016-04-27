function init() {
    "use strict";

	// Function to set JS canvas to Client canvas size
    function resize(canvas) {
        var displayWidth  = canvas.clientWidth;
        var displayHeight = canvas.clientHeight;

		// Check if the canvas is not the same size.
        if (canvas.width  != displayWidth || canvas.height != displayHeight) {
            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;
        }
    }

	// Create random number between 0 and settings.maxX or settings.maxY in game grid for random positioning
    function randomPos(max){

		// Generate random number between 0 and canvas width/height;
        var randomNumber = Math.floor(Math.random() * max);

        return randomNumber;
    }

    // select random position in grid
    function selectRandomPosition(x, y){
        var randomX = randomPos(x);
        var randomY = randomPos(y);
        return [randomX, randomY];
    }

    // Clear grid
    function clearCanvas(){
        // Remove old gridblocks
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Draw gridblocks
    function drawGrid(grid, blockWidth){
        // Loop trough grid arrays and draw gridBlock for each
        for ( var x = 0; x < grid.length; x++){
            for ( var y = 0; y < grid[x].length; y++){

                var thisGridBlock = grid[x][y];
                if (thisGridBlock){

                    // context.fillStyle = "rgb(" + [randomPos(255), randomPos(255), randomPos(255)] + ")";
                    context.fillRect(
                        // Set x position
                        x * blockWidth,
                        // Set y position
                        y * blockWidth,
                        // Set width
                        blockWidth,
                        // Set height
                        blockWidth
                    );
                }
            }
        }
    }

    function calculateGrid(){
        // Set grid to true when gridBlock is contains snake
        for ( var i = 0; i < snake.snakeSize; i++ ){
            var oldHead = snake.head.current;
            var head = snake.head.new;
            var direction = snake.move.map( function(v){
                return v * i;
            });

            var oldX = oldHead[X] - direction[X];
            var oldY = oldHead[Y] - direction[Y];
            var positionX = head[X] - direction[X];
            var positionY = head[Y] - direction[Y];

            // TODO: check if position is already true
                // TODO: if position is true, check if it is the random block
                    // TODO: if it is the random block, eat it
                    // TODO: otherwise gameOver = true


            // set snake position in grid
            console.log("Clear this flag: ", oldX, oldY)
            grid[oldX][oldY] = false;
            grid[positionX][positionY] = true;
            console.log(grid[positionX][positionY]);
        }

        console.log(grid.map(function (axis) {
            return axis.map(function (flag) {
                return flag ? "#" : " ";
            }).join('');
        }).join('\n'));
    }
        var counter = 0;

    // Function for movement of the snake
    function refreshCanvas(timeStamp){
        var start = timeStamp;
        var newPosition = snake.head.new;
        var width = canvasWidth / settings.blockSize;
        var height = canvasHeight / settings.blockSize;
        var canvas = [width, height];
        var newX, newY, rest;

        newX = newPosition[X] - snake.move[X];
        newY = newPosition[Y] - snake.move[Y];

        if (newX > canvas[X]){
            rest = newX - canvas[X];
            console.log(newX, rest, "too big!");
        }
        else if (newY > canvas[Y]){
            rest = newY - canvas[Y];
            console.log(newY, rest, "too big!");
        }
        else {
            console.log("yay");
            snake.head.current = newPosition;
            newPosition[X] = newX;
            newPosition[Y] = newY;
        }

        // console.log(newX, newY);

        clearCanvas();
        calculateGrid();
        drawGrid(grid, settings.blockSize);
        // console.log(JSON.stringify(grid));

        if (counter > 5) {
            gameOver = true;
        }

        //Do the whole thing again
        if ( !gameOver ){
            counter++;
            window.requestAnimationFrame(refreshCanvas);
        }
    }

	// Game
    function startGame(){
		// TODO: use lodash for mixins, for definition of settings when calling function
        settings = {
            blockSize: 10,
            nrOfBlocks: 1,
            snakeSize: 10,
            gameColor: "#000042",
            speed: "slow"
        };

        var gridBlock = settings.blockSize;
        var speed = {
            slow: 15,
            medium: 8,
            fast: 3
        };
        var startX = 0;
        var startY = 1;

        // Provide global snake object with start values
        snake = {
            move: LEFT,
            snakeSize: settings.snakeSize,
            head: {
                // current position in grid [x, y]
                current: [startX + settings.snakeSize, startY],
                // new position in grid [x, y]
                new: [startX + settings.snakeSize, startY]
            }
        };

        gameOver = false;

        // Find amount of gridBlocks for x and y axis
        var gridX = Math.floor(canvasWidth / gridBlock);
        var gridY = Math.floor(canvasHeight / gridBlock);

        // Generate (false = empty) grid in 2D array
        for ( var x = 0; x < gridX; x++ ){
            var gridWidth = [];
            for ( var y = 0; y < gridY; y++ ){
                gridWidth.push(false);
            }
            grid.push(gridWidth);
        }

        // Set one random grid[x][y] to true for each settings.nrOfBlocks
        for ( var i = 0; i < settings.nrOfBlocks; i++ ){

            var randomX, randomY;
            var treshold = gridX * gridY;
            // Create random x and y value for a false grid[x][y]
            do {
                var tried = 0;
                var randomPosition = selectRandomPosition(gridX, gridY);
                randomX = randomPosition[0];
                randomY = randomPosition[1];
                tried++;

                if ( tried > treshold ){
                    throw new Error("randomNumber exceeded 10, error!");
                }

            } while ( grid[randomX][randomY] === true);

            // Set one gridBlock to true
            grid[randomX][randomY] = true;
        }

		// Set color for game components
        context.fillStyle = settings.gameColor;

		// TODO: draw block for each grid[x][y] = true

   //      }

		// Create snake at start position
		// context.fillRect(0, grid, grid * settings.snakeSize, grid)

		// Move snake continuously with delay defined by speed
		// moveSnake();

			// If !moveOnYaxis AND !reverse
				// move snake from x = 0 to x = canvasWidth
				// When snake reaches end of canvas: start again at x = 0

			// If !moveOnYaxis AND reverse is set to true
				// move snake from x = canvasWidth to x = 0
				// When snake reaches end of canvas: start again at x = canvasWidth

			// If moveOnYaxis is set to true AND !reverse
				// move snake from y = 0 to y = canvasHeight
				// When snake reaches end of canvas: start again at y = 0

			// If moveOnYaxis is set to true AND reverse is set to true
				// move snake from y = canvasHeight to y = 0
				// When snake reaches end of canvas: start again at y = canvasHeight

		// Set eventListener for keyUp

			// When arrow key up (keycode 38) is pressed AND !moveOnYaxis
				// Set reverse to true
				// Set moveOnYaxis to true

			// When arrow key down (keycode 40) is pressed AND !moveOnYaxis
				// Set reverse to false
				// Set moveOnYaxis to true

			// When arrow key left (keycode 37) is pressed AND moveOnYaxis is true
				// Set reverse to true
				// Set moveOnYaxis to false

			// When arrow key right (keycode 39) is pressed AND moveOnYaxis is true
				// Set reverse to false
				// Set moveOnYaxis to false
            // Set recurring function/animation for rerendering grid
        window.requestAnimationFrame(refreshCanvas);
    }
    // Set axis and direction for movement [directionX, directionY]
    var UP = [0, -1], DOWN = [0, 1],  LEFT = [-1, 0],  RIGHT = [1, 0];
    var X = 0, Y = 1;
    var grid = [];
    var settings, snake, gameOver;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var canvasWidth = canvas.clientWidth;
    var canvasHeight = canvas.clientHeight;


	// Set canvas
    resize(canvas);

	// Start Game
    startGame();
}

window.onload = init;
