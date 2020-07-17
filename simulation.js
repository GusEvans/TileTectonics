'use strict';

// Preset Variables

var mapWidth = 12;
var mapHeight = 12;
var mapSize = mapWidth * mapHeight;
var plateCount = 9;
var plateMoveOptions = ["u", "r", "l", "d"];

var canvas = document.getElementById("art");
var ctx = art.getContext("2d");
var tileSize = 40;
var borderWidth = 3;
var boundaryWidth = 8;
var colors = {
	background: "FFF",
	border: "#050",
	boundary: "#000",
	oceanic: "#4BF",
	continental: "#9E4"
};

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
	console.log("Generating Map...");
	round = 0;
	plateTypes = [];
	for (i = 0; i < plateCount; i+=1) {
		j = Math.floor(Math.random() * 3);
		if (j == 0) {
			plateTypes.push("continental");
		} else {
			plateTypes.push("oceanic");
		}
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
	}
	for (i = 0; i < plateCount; i+=1) {
		for (j = 0; j < mapSize; j+=1) {
			plates[i].push(false);
		}
	}
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
	console.log("Round " + round);
	drawGrid();
	drawBoundaries();
	console.log("Map Generated!");
};
function genSquarePlate(plate, offset) {
	// Currently inefficient; will be generalized and put into main function later
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
	console.log("Moving Plates...");
	round += 0.5;
	for (i = 0; i < plateCount; i+=1) {
		tempPlate = [];
		if (plateMoves[i] == "r") {
			//console.log("Moving to the right!");
			for (j = 0; j < mapSize; j+=1){
				if ((j + 1) % 12 == 0) {
					tempPlate[j - 11] = plates[i][j];
				} else {
					tempPlate[j + 1] = plates[i][j];
				};
			};
			plates[i] = tempPlate;
		};
		if (plateMoves[i] == "l") {
			//console.log("Moving to the left!");
			for (j = 0; j < mapSize; j+=1){
				if ((j - 1) % 12 == 11 || j <= 0) {
					tempPlate[j + 11] = plates[i][j];
				} else {
					tempPlate[j - 1] = plates[i][j];
				};
			};
			plates[i] = tempPlate;
		};
		if (plateMoves[i] == "d") {
			//console.log("Moving to the down!");
			for (j = 0; j < mapSize; j+=1){
				if ((j + 12) >= mapSize) {
					tempPlate[j - 132] = plates[i][j];
				} else {
					tempPlate[j + 12] = plates[i][j];
				};
			};
			plates[i] = tempPlate;
		};
		if (plateMoves[i] == "u") {
			//console.log("Moving to the up!");
			for (j = 0; j < mapSize; j+=1){
				if ((j - 12) < 0) {
					tempPlate[j + 132] = plates[i][j];
				} else {
					tempPlate[j - 12] = plates[i][j];
				};
			};
			plates[i] = tempPlate;
		};
	};
	console.log(plates);
	console.log("Round " + round);
	//drawGrid();
	//drawBoundaries();
	console.log("Plates Moved!");
};

function resolve() {
	console.log("Allocating Tiles...");
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
		//console.log(competitors);
		// For now, empty tiles and conflict tiles can be handled the same way (plate type can be ignored)
		if (competitors !== 1) {
			// Find the prominence of plates in nearby tiles
			conflicts += 1;
			console.log("Conflict " + conflicts + " on tile " + i)
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
				if ((i + 1) % 12 == 0) {
					if (plates[j][i - 11] == true) {
						competition[j] += 1;
					};
				} else {
					if (plates[j][i + 1] == true) {
						competition[j] += 1;
					};
				};
				// Left tile
				if ((i - 1) % 12 == 11) {
					if (plates[j][i + 11] == true) {
						competition[j] += 1;
					};
				} else {
					if (plates[j][i - 1] == true) {
						competition[j] += 1;
					};
				};
				// Down tile
				if (i + 12 >= mapSize) {
					if (plates[j][i - 132] == true) {
						competition[j] += 1;
					};
				} else {
					if (plates[j][i + 12] == true) {
						competition[j] += 1;
					};
				};
				// Up tile
				if (i - 12 < 0) {
					if (plates[j][i + 132] == true) {
						competition[j] += 1;
					};
				} else {
					if (plates[j][i - 12] == true) {
						competition[j] += 1;
					};
				};
			};
			console.log(competition);
			// Find the highest plate influence
			mostInfluence = 0;
			for (j = 0; j < plateCount; j+=1) {
				if (competition[j] > mostInfluence) {
					mostInfluence = competition[j];
				};
			};
			console.log("Highest influence: " + mostInfluence);
			// Find how many plates have the highest influence
			prominentPlates = 0;
			for (j = 0; j < plateCount; j+=1) {
				if (competition[j] == mostInfluence) {
					prominentPlates += 1;
				};
			};
			console.log("Prominent plates: " + prominentPlates);
			if (prominentPlates == 1) {
				// Award tile to winner of competition
				for (j = 0; j < plateCount; j+=1) {
					if (competition[j] == mostInfluence) {
						console.log("Plate " + j + " has won!");
						for (k = 0; k < plateCount; k+=1) {
							if (k !== j) {
								interPlate[k][i] = false;
							} else {
								interPlate[j][i] = true;
							};
						};
					};
				};
			};
			if (prominentPlates !== 1) {
				// If there isn't a single winner, find the winners
				winners = [];
				for (j = 0; j < plateCount; j+=1) {
					if (competition[j] == mostInfluence) {
						winners.push(j);
					};
				};
				console.log(winners);
				// Find size of each plate (may become a function later)
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
				console.log(plateSizes);
				// Eliminate sizes of non-winners (there must be a better way to do this)
				smallestPlate = 0;
				for (j = 0; j < plateCount; j+=1) {
					if (!winners.includes(j)) {
						plateSizes[j] = mapSize + 1;
					};
				};
				console.log(plateSizes);
				// Allocate tile to winner with lowest size (finally)
				console.log("Plate " + plateSizes.indexOf(Math.min.apply(null, plateSizes)) + " has won!");
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
	console.log("Round " + round);
	//drawGrid();
	//drawBoundaries();
	console.log("Tiles Allocated!");
};

// Rendering Functions

function square(sx, sy, t) {
	ctx.strokeStyle = colors.border;
	ctx.lineWidth = t;
	ctx.strokeRect(sx, sy, tileSize, tileSize)
};
function drawGrid() {
	ctx.clearRect(0, 0, 480, 480);
	row = 0;
	column = 0;
	for (i = 0; i < mapSize; i+=1) {
		square(row * tileSize, column * tileSize, borderWidth);
		row += 1;
		if (row >= mapWidth) {
			column += 1;
			row = 0
		}
	}
};
function line(sx, sy, ex, ey, t) {
	ctx.strokeStyle = colors.boundary;
	ctx.lineCap = "square";
	ctx.lineWidth = t;
	ctx.moveTo(sx,sy);
	ctx.lineTo(ex,ey);
	ctx.stroke()
};
function drawBoundaries() {
	// To do: reduce dependence on the number 12
	lineCount = 0;
	// Horizontal Boundaries
	for (i = 0; i < plateCount; i+=1) {
		for (j = 0; j < mapSize; j+=1) {
			if ((j + 1) % 12 == 0) {
				if (plates[i][j] !== plates[i][j - 11]) {
					//console.log("hb");
					line((j % 12) * tileSize + tileSize, Math.floor(j / 12) * tileSize, (j % 12) * tileSize + tileSize, Math.floor(j / 12) * tileSize + tileSize, boundaryWidth);
					lineCount += 1;
				} else {
					//console.log("nhb");
				};
			} else if (plates[i][j] !== plates[i][j + 1]) {
				//console.log("hb");
				line((j % 12) * tileSize + tileSize, Math.floor(j / 12) * tileSize, (j % 12) * tileSize + tileSize, Math.floor(j / 12) * tileSize + tileSize, boundaryWidth);
				lineCount += 1;
			} else {
				//console.log("nhb");
			};
		};
	};
	// Vertical Boundaries
	for (i = 0; i < plateCount; i+=1) {
		for (j = 0; j < mapSize; j+=1) {
			if (j + 12 > mapSize) {
				if (plates[i][j] !== plates[i][j - 132]) {
					//console.log("vb");
					line((j % 12) * tileSize, Math.floor(j / 12) * tileSize + tileSize, (j % 12) * tileSize + tileSize, Math.floor(j / 12) * tileSize + tileSize, boundaryWidth);
					lineCount += 1;
				} else {
					//console.log("nvb");
				};
			} else if (plates[i][j] !== plates[i][j + 12]) {
				//console.log("vb");
				line((j % 12) * tileSize, Math.floor(j / 12) * tileSize + tileSize, (j % 12) * tileSize + tileSize, Math.floor(j / 12) * tileSize + tileSize, boundaryWidth);
				lineCount += 1;
			} else {
				//console.log("nvb");
			};
		};
	};
	console.log("Lines drawn: " + lineCount);
};

// Buttons

document.getElementById('gen').addEventListener('click', gen);
document.getElementById('move').addEventListener('click', move);
document.getElementById('resolve').addEventListener('click', resolve);
