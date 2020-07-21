'use strict';

// Preset Variables

var mapWidth = 12;
var mapHeight = 12;
var mapSize = mapWidth * mapHeight;
var plateCount = 9;
var plateMoveOptions = ["u", "r", "l", "d"]; // To do: add more of these

var canvas = document.getElementById("art");
var ctx = art.getContext("2d");
var tileSize = 36;
var borderWidth = 2;
var boundaryWidth = 6;
var colors = {
	border: "#FFF",
	boundary: "#000",
	oceanic: "#29D",
	continental: "#8C2",
	conflict: "#E22",
	empty: "#DDD"
};
var continentalColors = ["#DA1", "#FC3", "#FE7", "#DE2", "#9E1", "#6C2", "#4F5", "#0B4", "#7E9"];
var oceanicColors = ["#7EE", "#0CF", "#38B", "#48F", "#12D", "#98E", "#73E", "#B5E", "#E9E"];

// Changing Variables

var i;
var j;
var k;
var plates = [];
var plateTypes = [];
var plateMoves = [];
var plateSizes = [];
var tempPlate = [];
var interPlate = [];
var competition = [];
var winners = [];
var tileColor = [];
var round;
var conflicts;
var competitors;
var mostInfluence;
var prominentPlates;
var smallestPlate;
var row;
var column;
var lineCount;

// Simulation Functions

function gen() {
	//console.log("Generating Map...");
	round = 0;
	// To do: add a use for plate types
	plateTypes = [];
	for (i = 0; i < plateCount; i+=1) {
		j = Math.floor(Math.random() * 3);
		if (j == 0) {
			plateTypes.push("continental");
		} else {
			plateTypes.push("oceanic");
		};
	};
	console.log(plateTypes);
	plateMoves = [];
	for (i = 0; i < plateCount; i+=1) {
		j = Math.floor(Math.random() * plateMoveOptions.length);
		plateMoves[i] = plateMoveOptions[j];
	};
	console.log(plateMoves);
	plates = [];
	for (i = 0; i < plateCount; i+=1) {
		plates.push([]);
	};
	for (i = 0; i < plateCount; i+=1) {
		for (j = 0; j < mapSize; j+=1) {
			plates[i].push(false);
		};
	};
	genSquarePlate(0, 0);
	genSquarePlate(1, 4);
	genSquarePlate(2, 8);
	genSquarePlate(3, 48);
	genSquarePlate(4, 52);
	genSquarePlate(5, 56);
	genSquarePlate(6, 96);
	genSquarePlate(7, 100);
	genSquarePlate(8, 104);
	console.log(plates);
	document.getElementById('round').innerHTML = "Round: " + round;
	render();
	console.log("Map Generated!");
};
function genSquarePlate(plate, offset) {
	// To do: generalize this process and make it more efficient
	for (i = 0; i < offset; i+=1) {
		plates[plate][i] = false;
	};
	for (i = offset; i < offset + 4; i+=1) {
		plates[plate][i] = true;
	};
	for (i = offset + 4; i < offset + 12; i+=1) {
		plates[plate][i] = false;
	};
	for (i = offset + 12; i < offset + 16; i+=1) {
		plates[plate][i] = true;
	};
	for (i = offset + 16; i < offset + 24; i+=1) {
		plates[plate][i] = false;
	};
	for (i = offset + 24; i < offset + 28; i+=1) {
		plates[plate][i] = true;
	};
	for (i = offset + 28; i < offset + 36; i+=1) {
		plates[plate][i] = false;
	};
	for (i = offset + 36; i < offset + 40; i+=1) {
		plates[plate][i] = true;
	};
	for (i = offset + 40; i < mapSize; i+=1) {
		plates[plate][i] = false;
	};
};

function move() {
	//console.log("Moving Plates...");
	round += 0.5;
	for (i = 0; i < plateCount; i+=1) {
		tempPlate = [];
		if (plateMoves[i] == "r") {
			//console.log("Moving to the right!");
			for (j = 0; j < mapSize; j+=1){
				if ((j + 1) % mapWidth == 0) {
					tempPlate[j - mapWidth + 1] = plates[i][j];
				} else {
					tempPlate[j + 1] = plates[i][j];
				};
			};
			plates[i] = tempPlate;
		};
		if (plateMoves[i] == "l") {
			//console.log("Moving to the left!");
			for (j = 0; j < mapSize; j+=1){
				if ((j - 1) % mapWidth == mapWidth - 1 || j <= 0) {
					tempPlate[j + mapWidth - 1] = plates[i][j];
				} else {
					tempPlate[j - 1] = plates[i][j];
				};
			};
			plates[i] = tempPlate;
		};
		if (plateMoves[i] == "d") {
			//console.log("Moving to the down!");
			for (j = 0; j < mapSize; j+=1){
				if ((j + mapWidth) >= mapSize) {
					tempPlate[j - mapSize + mapWidth] = plates[i][j];
				} else {
					tempPlate[j + mapWidth] = plates[i][j];
				};
			};
			plates[i] = tempPlate;
		};
		if (plateMoves[i] == "u") {
			//console.log("Moving to the up!");
			for (j = 0; j < mapSize; j+=1){
				if ((j - mapWidth) < 0) {
					tempPlate[j + mapSize - mapWidth] = plates[i][j];
				} else {
					tempPlate[j - mapWidth] = plates[i][j];
				};
			};
			plates[i] = tempPlate;
		};
	};
	console.log(plates);
	document.getElementById('round').innerHTML = "Round: " + round;
	render();
	console.log("Plates Moved!");
};

function resolve() {
	//console.log("Allocating Tiles...");
	round += 0.5;
	conflicts = 0;
	interPlate = plates;
	for (i = 0; i < mapSize; i+=1) {
		// How many plates is tile i in?
		competitors = 0;
		for (j = 0; j < plateCount; j+=1) {
			if (plates[j][i] == true) {
				competitors += 1;
			};
		};
		if (competitors == 1) {
			continue;
		} else {
			// For now, empty tiles and conflict tiles can be handled the same way (plate type can be ignored)
			// Find the prominence of plates in nearby tiles
			conflicts += 1;
			//console.log("Conflict " + conflicts + " on tile " + i)
			competition = [];
			for (j = 0; j < plateCount; j+=1) {
				competition.push(0);
			};
			for (j = 0; j < plateCount; j+=1) {
				// Target tile
				if (plates[j][i] == true) {
					competition[j] += 1;
				};
				// Right tile
				if ((i + 1) % mapWidth == 0) {
					if (plates[j][i - mapWidth + 1] == true) {
						competition[j] += 1;
					};
				} else {
					if (plates[j][i + 1] == true) {
						competition[j] += 1;
					};
				};
				// Left tile
				if ((i - 1) % mapWidth == mapWidth - 1) {
					if (plates[j][i + mapWidth - 1] == true) {
						competition[j] += 1;
					};
				} else {
					if (plates[j][i - 1] == true) {
						competition[j] += 1;
					};
				};
				// Down tile
				if (i + mapWidth >= mapSize) {
					if (plates[j][i - mapSize + mapWidth] == true) {
						competition[j] += 1;
					};
				} else {
					if (plates[j][i + mapWidth] == true) {
						competition[j] += 1;
					};
				};
				// Up tile
				if (i - mapWidth < 0) {
					if (plates[j][i + mapSize - mapWidth] == true) {
						competition[j] += 1;
					};
				} else {
					if (plates[j][i - mapWidth] == true) {
						competition[j] += 1;
					};
				};
			};
			//console.log(competition);
			// Find the highest plate influence
			mostInfluence = 0;
			for (j = 0; j < plateCount; j+=1) {
				if (competition[j] > mostInfluence) {
					mostInfluence = competition[j];
				};
			};
			//console.log("Highest influence: " + mostInfluence);
			// Find how many plates have the highest influence
			prominentPlates = 0;
			for (j = 0; j < plateCount; j+=1) {
				if (competition[j] == mostInfluence) {
					prominentPlates += 1;
				};
			};
			//console.log("Prominent plates: " + prominentPlates);
			if (prominentPlates == 1) {
				// Award tile to winner of competition
				for (j = 0; j < plateCount; j+=1) {
					if (competition[j] == mostInfluence) {
						//console.log("Plate " + j + " has won!");
						for (k = 0; k < plateCount; k+=1) {
							if (k !== j) {
								interPlate[k][i] = false;
							} else {
								interPlate[j][i] = true;
							};
						};
					};
				};
			} else {
				// If there isn't a single winner, find the winners
				winners = [];
				for (j = 0; j < plateCount; j+=1) {
					if (competition[j] == mostInfluence) {
						winners.push(j);
					};
				};
				//console.log(winners);
				// Find size of each plate
				findPlateSizes();
				//console.log(plateSizes);	
				// Eliminate sizes of non-winners (To do: combine this step with the next one)
				smallestPlate = 0;
				for (j = 0; j < plateCount; j+=1) {
					if (!winners.includes(j)) {
						plateSizes[j] = mapSize + 1;
					};
				};
				//console.log(plateSizes);
				// Allocate tile to winner with lowest size (finally)
				//console.log("Plate " + plateSizes.indexOf(Math.min.apply(null, plateSizes)) + " has won!");
				for (j = 0; j < plateCount; j+=1) {
					if (j !== plateSizes.indexOf(Math.min.apply(null, plateSizes))) {
						interPlate[j][i] = false;
					} else {
						interPlate[plateSizes.indexOf(Math.min.apply(null, plateSizes))][i] = true;
					};
				};
			};
		};
	};
	plates = interPlate;
	console.log(plates);
	document.getElementById('round').innerHTML = "Round: " + round;
	render();
	console.log("Tiles Allocated!");
};
function findPlateSizes() {
	// To do: work out why the sizes change within a round
	plateSizes = [];
	for (j = 0; j < plateCount; j+=1) {
		plateSizes.push(0);
	};
	for (j = 0; j < plateCount; j+=1) {
		for (k = 0; k < mapSize; k+=1) {
			if (plates[j][k] == true) {
				plateSizes[j] += 1;
			};
		};
	};
};

function moveResolve() {
	move();
	resolve();
};

// Rendering Functions

function render() {
	drawGrid();
	drawBoundaries();
};

function square(sx, sy, col) {
	ctx.strokeStyle = colors.border;
	ctx.lineWidth = borderWidth;
	ctx.fillStyle = col;
	ctx.fillRect(sx, sy, tileSize, tileSize);
	ctx.strokeRect(sx, sy, tileSize, tileSize);
};

function drawGrid() {
	ctx.clearRect(0, 0, 480, 480);
	row = 0;
	column = 0;
	for (i = 0; i < mapSize; i+=1) {
		tileColor = [];
		for (j = 0; j < plateCount; j+=1){
			if (plates[j][i] == true) {
				tileColor.push(j);
			};
		};
		//console.log(tileColor);
		if (tileColor.length == 0) {
			square(column * tileSize, row * tileSize, colors.empty,);
			//console.log("empty");
		};
		if (tileColor.length > 1) {
			square(column * tileSize, row * tileSize, colors.conflict,);
			//console.log("conflict");
		};
		if (tileColor.length == 1) {
			if (plateTypes[tileColor[0]] == "continental") {
				square(column * tileSize, row * tileSize, continentalColors[tileColor[0]],);
				//console.log("continental");
			};
			if (plateTypes[tileColor[0]] == "oceanic") {
				square(column * tileSize, row * tileSize, oceanicColors[tileColor[0]],);
				//console.log("oceanic");
			};
		};
		column += 1;
		if (column >= mapWidth) {
			row += 1;
			column = 0;
		};
	};
};

function line(sx, sy, ex, ey, t) {
	ctx.strokeStyle = colors.boundary;
	ctx.lineCap = "square";
	ctx.lineWidth = t;
	ctx.beginPath();
	ctx.moveTo(sx,sy);
	ctx.lineTo(ex,ey);
	ctx.stroke();
	lineCount += 1;
};

function drawBoundaries() {
	lineCount = 0;
	// Horizontal Boundaries
	for (i = 0; i < plateCount; i+=1) {
		for (j = 0; j < mapSize; j+=1) {
			if ((j + 1) % mapWidth == 0) {
				if (plates[i][j] !== plates[i][j - mapWidth + 1]) {
					//console.log("hb");
					// Go to top-right and draw down
					line((j % mapWidth) * tileSize + tileSize, Math.floor(j / mapWidth) * tileSize, (j % mapWidth) * tileSize + tileSize, Math.floor(j / mapWidth) * tileSize + tileSize, boundaryWidth);
					// Then go to left edge of map and draw down
					line(0, Math.floor(j / mapWidth) * tileSize, 0, Math.floor(j / mapWidth) * tileSize + tileSize, boundaryWidth);
				} else {
					//console.log("nhb");
				};
			} else if (plates[i][j] !== plates[i][j + 1]) {
				//console.log("hb");
				// Go to top-right and draw down
				line((j % mapWidth) * tileSize + tileSize, Math.floor(j / mapWidth) * tileSize, (j % mapWidth) * tileSize + tileSize, Math.floor(j / mapWidth) * tileSize + tileSize, boundaryWidth);
			} else {
				//console.log("nhb");
			};
		};
	};
	// Vertical Boundaries
	for (i = 0; i < plateCount; i+=1) {
		for (j = 0; j < mapSize; j+=1) {
			if (j + mapWidth >= mapSize) {
				if (plates[i][j] !== plates[i][j - mapSize + mapWidth]) {
					//console.log("vb");
					// Go to bottom-left and draw right
					line((j % mapWidth) * tileSize, Math.floor(j / mapWidth) * tileSize + tileSize, (j % mapWidth) * tileSize + tileSize, Math.floor(j / mapWidth) * tileSize + tileSize, boundaryWidth);
					// Then go to top edge of map and draw right
					line((j % mapWidth) * tileSize, 0, (j % mapWidth) * tileSize + tileSize, 0, boundaryWidth);
				} else {
					//console.log("nvb");
				};
			} else if (plates[i][j] !== plates[i][j + mapWidth]) {
				//console.log("vb");
				// Go to bottom-left and draw right
				line((j % mapWidth) * tileSize, Math.floor(j / mapWidth) * tileSize + tileSize, (j % mapWidth) * tileSize + tileSize, Math.floor(j / mapWidth) * tileSize + tileSize, boundaryWidth);
			} else {
				//console.log("nvb");
			};
		};
	};
	//console.log("Lines drawn: " + lineCount);
};

// Controls

document.getElementById('gen').addEventListener('click', gen);
document.getElementById('move').addEventListener('click', move);
document.getElementById('resolve').addEventListener('click', resolve);
document.getElementById('fast').addEventListener('click', moveResolve);
