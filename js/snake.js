function start() {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var posX = Math.floor((Math.random() * 298));
	console.log(posX);
	var posY = Math.floor((Math.random() * 149));;
	console.log(posY);
	context.fillStyle = "black";
	// (position x, position y, width, height)
	context.fillRect(posX, posY, 2, 1);
}

window.onload = start;