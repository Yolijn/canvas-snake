function start() {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var maxX = 298;
	var maxY = 149;
	var blockWidth = 4;
	var blockHeight = 2;
	var randomBlocks = 10;
	var snakeLength = 10;

	context.fillStyle = "#424242";

	// Create random number between 0 and maxX or maxY for random positioning
	function randomPos(max){
		var position = Math.floor(Math.random() * max);
		return position;
	}

	
	// Fill canvas with random blocks
	for (i = 1; i <= randomBlocks; i++){
		context.fillRect(randomPos(maxX), randomPos(maxY), blockWidth, blockHeight);	
	}

	// Create snake at start position
	context.fillRect(2, 1, blockWidth * snakeLength, blockHeight)
}

window.onload = start;