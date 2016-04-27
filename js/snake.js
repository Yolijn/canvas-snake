function init() {
    "use strict";

	// Function to set JS canvas to Client canvas size
    function resize(canvas) {
        // Lookup the size the browser is displaying the canvas.
        var displayWidth  = canvas.clientWidth;
        var displayHeight = canvas.clientHeight;

        // Check if the canvas is not the same size.
        if (canvas.width  != displayWidth ||
            canvas.height != displayHeight) {
            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;
        }
    }

	// Create random number between 0 and settings.maxX or settings.maxY in game grid for random positioning
    function randomNumber(max){
		// Generate random number between 0 and canvas width/height;
        var randomNumber = Math.floor(Math.random() * max);
        return randomNumber;
    }

    // Clear grid
    function clearCanvas(){
        // Remove old gridblocks
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Initialise empty grid
    function initGrid(){
        for ( var x = 0; x < gridWidth; x++ ){
            var gridArray = [];
            for ( var y = 0; y < gridHeight; y++ ){
                gridArray.push(false);
            }
            // An array with a false value for each height/widt combination
            grid.push(gridArray);
        }
    }

    // Draw gridblocks
    function drawGrid(grid, blockWidth){
        // Loop trough grid arrays and draw gridBlock for each
        for ( var x = 0; x < grid.length; x++){
            for ( var y = 0; y < grid[x].length; y++){

                var thisGridBlock = grid[x][y];
                if (thisGridBlock){
                    context.fillStyle = settings.color;
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

    // Find grid position of all snake blocks
    function findSnake(head, direction, length){
        var newPosition = snake.new;
        var snakeHead = snake.head.gridPosition;

        // Set old snake coordinates to current coordinates
        snake.old = newPosition;
        // Set snakeHead to given head value
        snakeHead = head;

        // Set position for each snakeBlock, counting from the head
        for ( var i = 0; i < snake.size; i++ ){
            //Direction to retract, get 0 if it's the head
            var retract = direction.map(function(direction){
                return direction * i;
            });
            // Find block X by retracting direction
            var blockX = head[X] - retract[X];
            var blockY = head[Y] - retract[Y];
            // Add these coordinates to snake.new
            newPosition.push([blockX, blockY]);
        }
    }

    function calculateGrid(){

        // Create random foodBlock
        var randomX, randomY, counter = 0;
        do {
            var randomX = randomNumber(gridWidth);
            var randomY = randomNumber(gridHeight);
            counter++;
        } while ( !grid[randomX][randomY] && counter < 2);

        // Reset counter for next time and set foodBlock
        counter = 0;
        grid[randomX][randomY] = true;

        // Remove old snake
        for ( var i = 0; i < snake.old.length; i++ ){
            var old = snake.old[i];
            grid[old[X]][old[Y]] = false;
        }

        // Set new snake
        for ( var i = 0; i < snake.new.length; i++ ){
            var current = snake.new[i];
            grid[current[X]][current[Y]] = true;
        }
    }

    // Function for movement of the snake
    function refreshCanvas(timeStamp){

        calculateGrid();
        clearCanvas();
        drawGrid(grid, settings.blockSize);

        // Refresh until gameOver
        if ( gameOver ){
            window.requestAnimationFrame(refreshCanvas);
        }
    }

	// Game
    function startGame(){
        var startX = settings.size - 1;
        var startY = 1;
        snake = {
            head: {
                gridPosition: [startX, startY],
                fitsGrid: true
            },
            old: [],
            new: [],
            direction: settings.direction,
            size: settings.size
        };

        gameOver = false;
        initGrid();
        findSnake(snake.head.gridPosition, snake.direction, snake.size);
        window.requestAnimationFrame(refreshCanvas);
    }

    // Set axis and direction for movement [directionX, directionY]
    var UP = [0, -1], DOWN = [0, 1],  LEFT = [-1, 0],  RIGHT = [1, 0];
    var X = 0, Y = 1;
    var grid = [];
    var snake, gameOver;
    var settings = { blockSize: 10, speed: 0, size: 10, direction: RIGHT, color: "#000042" };
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var canvasWidth = canvas.clientWidth;
    var canvasHeight = canvas.clientHeight;
    var gridWidth = canvasWidth / settings.blockSize;
    var gridHeight = canvasHeight / settings.blockSize;

	// Set canvas
    resize(canvas);
	// Start Game
    startGame();
}

window.onload = init;
