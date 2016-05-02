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

    /**
     * Move snake
     * @param {Vector2} direction
     */
    function move(direction){
        var speed = snake.speed;
        var headPosition = snake.head.gridPosition;
        var move;

        // If no new coordinates in path, snake.recalculate will be false
        if ( !snake.recalculate ){
            // Calculate new head position by adding direction * speed
            move = {
                x: headPosition.x + ( direction.x * speed ),
                y: headPosition.y + ( direction.y * speed )
            };

            move.x %= gridWidth;
            move.y %= gridHeight;
            // if (move.x == gridWidth)
                // move.x = 0;

            if ( grid[move.x] != undefined && grid[move.x][move.y] != undefined ){
                snake.head.gridPosition = move; //[move.x, move.y];
                findSnake(snake.head.gridPosition);
            }
            else if ( move.x >= grid.length ) {
                snake.recalculate = true;
                // console.log("X too big: " + move.x);
            }
            else if ( move.x < 0 ){
                snake.recalculate = true;
                // console.log("X too small: " + move.x);
            }
            else if ( move.y >= grid[0].length ){
                snake.recalculate = true;
                // console.log("Y too big: " + move.y);
            }
            else if ( move.y < 0 ){
                snake.recalculate = true;
                // console.log("Y too small: " + move.y);
            }
            else {
                // console.log(move.x, move.y);
            }
        }
        else {
            // recalculate snake

        }
    }

    // Find grid position of all snake blocks
    function findSnake(head){
        // var snakeHead = ;
        var direction = snake.direction;
        var route = snake.route;
        var snakeLength = snake.size;

        // Set old snake coordinates to current coordinates
        snake.old = snake.new;
        // Remove old coordinates from current
        snake.new = [];
        // Set snakeHead to given head value
        snake.head.gridPosition = head;

        // Set position for each snakeBlock, counting from the head
        for ( var i = 0; i < snake.size; i++ ){
            // Direction to retract, get 0 if it's the head
            var retract = {
                x: direction.x * i,
                y: direction.y * i
            };

            // Find block X by retracting direction
            var blockX = head.x - retract.x;
            var blockY = head.y - retract.y;

            if (blockX < 0)
                blockX = gridWidth + blockX % gridWidth;
            if (blockY < 0)
                blockY = gridHeight + blockY % gridHeight;
            // Add these coordinates to snake.new
            snake.new.push({ x: blockX, y: blockY });
        }
    }

    function calculateGrid(){
        var foodBlock = snake.foodBlock;
        // Create random foodBlock if non exists
        if (!foodBlock){
            var randomX, randomY, counter = 0;
            do {
                randomX = randomNumber(gridWidth);
                randomY = randomNumber(gridHeight);
                counter++;
            } while ( !grid[randomX][randomY] && counter < 2);

            // Reset counter for next time and set foodBlock
            counter = 0;
            grid[randomX][randomY] = true;
            foodBlock = [randomX, randomY];
            // Set current foodBlock value to snake
            snake.foodBlock = foodBlock;
        }

        var i;

        // Remove old snake
        for ( i = 0; i < snake.old.length; i++ ){
            var old = snake.old[i];
            grid[old.x | 0][old.y | 0] = false;
        }

        // Set new snake
        for ( i = 0; i < snake.new.length; i++ ){
            var current = snake.new[i];
            if (!grid[current.x | 0])
                console.log("X doesn't exist in grid: ", current.x)
            grid[current.x | 0][current.y | 0] = true;
        }
    }

    // Function for movement of the snake
    function refreshCanvas(renderTime){
        var now = Date.now();
        var progress = (now - snake.timeStamp) / 1000;
        // newPosition = snake.offsetPosition.add(snake.direction.multiply(snake.speed * progress))
        var newPosition = {
            x: (snake.offsetPosition.x + progress * snake.speed * snake.direction.x),
            y: (snake.offsetPosition.y + progress * snake.speed * snake.direction.y)
        };
        snake.head.gridPosition = newPosition;
        findSnake(snake.head.gridPosition);
        // TODO: Somehow use requestAnimationFrame timestamp in gameStart() function to set initial time
        // Then we can stop using the slower and inaccurate Date.now()
        calculateGrid();
        clearCanvas();
        drawGrid(grid, settings.blockSize);

        context.fillRect(
            // Set x position
            snake.head.gridPosition.x * settings.blockSize,
            // Set y position
            snake.head.gridPosition.y * settings.blockSize,
            // Set width
            settings.blockSize,
            // Set height
            settings.blockSize
        );

        // Refresh until gameOver
        if ( !gameOver ){
            window.requestAnimationFrame(refreshCanvas);
        }
    }

    /**
     * @param {Vector2} direction
     */
    function go(direction, desc)
    {
        // TODO: Prevent moving in the current direction and prevent reversing: ergo, prevent moving on the same axis
        console.log("move " + desc);
        snake.offsetPosition = snake.head.gridPosition;
        snake.direction = direction;
        snake.changedDirection = true;
        snake.timeStamp = Date.now();
        snake.route.push(direction);
    }

	// Game
    function startGame(){
        var startX = settings.size - 1;
        var startY = 1;
        snake = {
            head: {
                // @type {Vector2}
                gridPosition: {
                    x: Math.round(gridWidth / 2),
                    y: Math.round(gridHeight/ 2)
                },
                // TODO: Document this property
                fitsGrid: true
            },
            // @type {Array<Vector2>}
            old: [],
            // @type {Array<Vector2>}
            new: [],
            footblock: undefined,
            // @type {Vector2} Coordinates where the direction was set the last time
            offsetPosition: undefined,
            // @type {Vector2}
            direction: settings.direction,
            changedDirection: false,
            size: settings.size,
            speed: settings.speed,
            // @type {Array<Vector2>}
            route: [],
            recalculate: false,
            timeStamp: undefined
        };

        go(settings.direction);

        document.addEventListener("keyup", function(event){
            var ARR_LEFT = 37,
                ARR_UP = 38,
                ARR_RIGHT = 39,
                ARR_DOWN = 40;

            // LEFT arrow key is pressed and released
            if ( event.keyCode === ARR_LEFT ) {
                go(LEFT, "left");
            }
            // UP arrow key is pressed and released
            else if ( event.keyCode === ARR_UP ){
                go(UP, "up");
            }
            // RIGHT arrow key is pressed and released
            else if ( event.keyCode === ARR_RIGHT ){
                go(RIGHT, "right");
            }
            // DOWN arrow key is pressed and released
            else if ( event.keyCode === ARR_DOWN ){
                go(DOWN, "down");
            }
        });

        gameOver = false;
        initGrid();
        findSnake(snake.head.gridPosition);
        window.requestAnimationFrame(refreshCanvas);
    }

    /** @typedef {{ x: Number, y: Number }} */
    var Vector2;

    // Set axis and direction for movement [directionX, directionY]
    var UP = { x: 0, y: -1 },
        DOWN = { x: 0, y: 1 },
        LEFT = { x: -1, y: 0 },
        RIGHT = { x: 1, y: 0 };

    var grid = [];
    var snake, gameOver;
    var settings = {
        blockSize: 10,
        speed: 8,
        size: 10,
        direction: RIGHT,
        color: "#000042"
    };
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
