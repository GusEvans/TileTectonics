'use strict';

/* Variables that don't change */

var canvas = document.getElementById("art");
var ctx = art.getContext("2d");
var borderWidth = 2;
var boundaryWidth = 6;
var colors = {border: "#FFF", boundary: "#000", conflict: "#E22", empty: "#DDD", oceanic: "#29D", continental: "#8C2"};
var continentalColors = ["#DA1", "#FC3", "#FE7", "#DE2", "#9E1", "#6C2", "#4F5", "#093", "#7E9"];
var oceanicColors = ["#8DE", "#0CF", "#38B", "#46F", "#12D", "#98E", "#73E", "#B5E", "#E9E"];
var plateMoveOptions = ["u", "r", "l", "d", "ur", "ul", "ru", "rd", "dr", "dl", "lu", "ld",
	"uur", "uru", "ruu", "uul", "ulu", "luu", "rru", "rur", "urr", "rrd", "rdr", "drr",
	"ddr", "drd", "rdd", "ddl", "dld", "ldd", "llu", "lul", "ull", "lld", "ldl", "dll"];

/* Variables set in map generation */

var mapWidth;
var mapHeight;
var mapSize;
var rowCount;
var columnCount;
var plateCount;
var tileSize;

/* Variables that change frequently */

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
var tempSizes = [];
var tileColor = [];
var round;
var offset;
var offsetLimit;
var conflicts;
var competitors;
var mostInfluence;
var prominentPlates;
var winnerCount;
var smallestPlate;
var row;
var column;
var lineCount;

/* Simulation Functions */

function gen3() {
	/* Generation settings */
	mapWidth = 12;
	mapHeight = 12;
	mapSize = mapWidth * mapHeight;
	rowCount = 3;
	columnCount = 3;
	plateCount = rowCount * columnCount;
	tileSize = 32;
	canvas.width = mapWidth * tileSize;
	canvas.height = mapHeight * tileSize;
	/* Standard setup procedure */
	plateSetup();
	plateGen();
	round = 0;
	document.getElementById('round').innerHTML = "Round: " + round;
	render();
	console.log("Map Generated!");
};
function gen2() {
	/* Generation settings */
	mapWidth = 10;
	mapHeight = 10;
	mapSize = mapWidth * mapHeight;
	rowCount = 2;
	columnCount = 2;
	plateCount = rowCount * columnCount;
	tileSize = 36;
	canvas.width = mapWidth * tileSize;
	canvas.height = mapHeight * tileSize;
	/* Standard setup procedure */
	plateSetup();
	plateGen();
	round = 0;
	document.getElementById('round').innerHTML = "Round: " + round;
	render();
	console.log("Map Generated!");
};
function genL() {
	/* Generation settings */
	mapWidth = 24;
	mapHeight = 24;
	mapSize = mapWidth * mapHeight;
	rowCount = 4;
	columnCount = 4;
	plateCount = rowCount * columnCount;
	tileSize = 20;
	canvas.width = mapWidth * tileSize;
	canvas.height = mapHeight * tileSize;
	/* Standard setup procedure */
	plateSetup();
	plateGen();
	round = 0;
	document.getElementById('round').innerHTML = "Round: " + round;
	render();
	console.log("Map Generated!");
};
function genR() {
	/* Generation settings */
	mapWidth = 20;
	mapHeight = 10;
	mapSize = mapWidth * mapHeight;
	rowCount = 2;
	columnCount = 4;
	plateCount = rowCount * columnCount;
	tileSize = 36;
	canvas.width = mapWidth * tileSize;
	canvas.height = mapHeight * tileSize;
	/* Standard setup procedure */
	plateSetup();
	plateGen();
	round = 0;
	document.getElementById('round').innerHTML = "Round: " + round;
	render();
	console.log("Map Generated!");
};
function plateSetup() {
	plateTypes = [];
	for (i = 0; i < plateCount; i+=1) {
		j = Math.floor(Math.random() * 2);
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
};
function plateGen() {
	/* Note: This plate generation system is only able to make plates in rectangular grids. */
	for (i = 0; i < plateCount; i+=1) {
		offset = Math.floor(i / columnCount) * ((mapHeight / rowCount) * mapWidth) + ((i % columnCount) * (mapWidth / columnCount));
		offsetLimit = offset + (mapSize / rowCount);
		//console.log(offset);
		for (j = 0; j < offset; j+=1) {
			plates[i][j] = false;
		};
		while (offset < offsetLimit) {
			for (j = offset; j < offset + (mapWidth / columnCount); j+=1) {
				plates[i][j] = true;
			};
			offset = offset + (mapWidth / columnCount);
			if (offset + ((columnCount - 1) * (mapWidth / columnCount)) < mapWidth) {
				for (j = offset; j < offset + ((columnCount - 1) * (mapWidth / columnCount)); j+=1) {
					plates[i][j] = false;
				};
			};
			offset = offset + ((columnCount - 1) * (mapWidth / columnCount));
		};
		for (j = offsetLimit; j < mapSize; j+=1) {
			plates[i][j] = false;
		};
	};
	//console.log(plates);
};

function move() {
	round += 0.5;
	for (i = 0; i < plateCount; i+=1) {
		tempPlate = [];
		if (plateMoves[i][0] == "r") {
			//console.log("Moving to the right!");
			for (j = 0; j < mapSize; j+=1) {
				if ((j + 1) % mapWidth == 0) {
					tempPlate[j - mapWidth + 1] = plates[i][j];
				} else {
					tempPlate[j + 1] = plates[i][j];
				};
			};
			plates[i] = tempPlate;
			if (plateMoves[i].length == 2) {
				plateMoves[i] = plateMoves[i][1] + "r";
			};
			if (plateMoves[i].length == 3) {
				plateMoves[i] = plateMoves[i][1] + plateMoves[i][2] + "r";
			};
			continue;
		};
		if (plateMoves[i][0] == "l") {
			//console.log("Moving to the left!");
			for (j = 0; j < mapSize; j+=1){
				if ((j - 1) % mapWidth == mapWidth - 1 || j <= 0) {
					tempPlate[j + mapWidth - 1] = plates[i][j];
				} else {
					tempPlate[j - 1] = plates[i][j];
				};
			};
			plates[i] = tempPlate;
			if (plateMoves[i].length == 2) {
				plateMoves[i] = plateMoves[i][1] + "l";
			};
			if (plateMoves[i].length == 3) {
				plateMoves[i] = plateMoves[i][1] + plateMoves[i][2] + "l";
			};
			continue;
		};
		if (plateMoves[i][0] == "d") {
			//console.log("Moving to the down!");
			for (j = 0; j < mapSize; j+=1){
				if ((j + mapWidth) >= mapSize) {
					tempPlate[j - mapSize + mapWidth] = plates[i][j];
				} else {
					tempPlate[j + mapWidth] = plates[i][j];
				};
			};
			plates[i] = tempPlate;
			if (plateMoves[i].length == 2) {
				plateMoves[i] = plateMoves[i][1] + "d";
			};
			if (plateMoves[i].length == 3) {
				plateMoves[i] = plateMoves[i][1] + plateMoves[i][2] + "d";
			};
			continue;
		};
		if (plateMoves[i][0] == "u") {
			//console.log("Moving to the up!");
			for (j = 0; j < mapSize; j+=1){
				if ((j - mapWidth) < 0) {
					tempPlate[j + mapSize - mapWidth] = plates[i][j];
				} else {
					tempPlate[j - mapWidth] = plates[i][j];
				};
			};
			plates[i] = tempPlate;
			if (plateMoves[i].length == 2) {
				plateMoves[i] = plateMoves[i][1] + "u";
			};
			if (plateMoves[i].length == 3) {
				plateMoves[i] = plateMoves[i][1] + plateMoves[i][2] + "u";
			};
			continue;
		};
	};
	//console.log(plates);
	//console.log(plateMoves);
	document.getElementById('round').innerHTML = "Round: " + round;
	render();
	console.log("Plates Moved!");
};

function resolve() {
	round += 0.5;
	conflicts = 0;
	interPlate = [];
	for (let el of plates) {
		interPlate.push(el.slice());
	};
	/* Find size of each plate (this is done here for efficiency) */
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
	/* The main loop */
	for (i = 0; i < mapSize; i+=1) {
		/* How many plates is tile i in? */
		competitors = 0;
		for (j = 0; j < plateCount; j+=1) {
			if (plates[j][i] == true) {
				competitors += 1;
			};
		};
		if (competitors == 1) {
			continue;
		} else {
			/* Find the prominence of plates in nearby tiles */
			conflicts += 1;
			//console.log("Conflict " + conflicts + " on tile " + i)
			competition = [];
			for (j = 0; j < plateCount; j+=1) {
				competition.push(0);
			};
			for (j = 0; j < plateCount; j+=1) {
				/* Target tile */
				if (plates[j][i] == true) {
					competition[j] += 1;
				};
				/* Right tile */
				if ((i + 1) % mapWidth == 0) {
					if (plates[j][i - mapWidth + 1] == true) {
						competition[j] += 1;
					};
				} else {
					if (plates[j][i + 1] == true) {
						competition[j] += 1;
					};
				};
				/* Left tile */
				if ((i - 1) % mapWidth == mapWidth - 1) {
					if (plates[j][i + mapWidth - 1] == true) {
						competition[j] += 1;
					};
				} else {
					if (plates[j][i - 1] == true) {
						competition[j] += 1;
					};
				};
				/* Down tile */
				if (i + mapWidth >= mapSize) {
					if (plates[j][i - mapSize + mapWidth] == true) {
						competition[j] += 1;
					};
				} else {
					if (plates[j][i + mapWidth] == true) {
						competition[j] += 1;
					};
				};
				/* Up tile */
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
			/* Find the highest plate influence */
			mostInfluence = 0;
			for (j = 0; j < plateCount; j+=1) {
				if (competition[j] > mostInfluence) {
					mostInfluence = competition[j];
				};
			};
			//console.log("Highest influence: " + mostInfluence);
			/* Find how many plates have the highest influence */
			prominentPlates = 0;
			for (j = 0; j < plateCount; j+=1) {
				if (competition[j] == mostInfluence) {
					prominentPlates += 1;
				};
			};
			//console.log("Prominent plates: " + prominentPlates);
			if (prominentPlates == 1) {
				/* Award tile to winner of competition */
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
				/* If there isn't a single winner, find the winners */
				winners = [];
				for (j = 0; j < plateCount; j+=1) {
					if (competition[j] == mostInfluence) {
						winners.push(j);
					};
				};
				//console.log(winners);
				winnerCount = winners.length;
				/* Check if oceanic plates have priority */
				if (competitors == 0) {
					for (j = 0; j < winnerCount; j+=1) {
						if (plateTypes[winners[j]] == "oceanic") {
							//console.log("REMOVE THE CONTINENTALS!")
							for (k = winnerCount; k > 0; k-=1) {
								if (plateTypes[winners[k]] == "continental") {
									//console.log("Removed plate " + winners[k])
									winners.splice(k, 1);
								};
							};
						};
					};
				};
				/* Check if continental plates have priority */
				if (competitors > 1) {
					for (j = 0; j < winnerCount; j+=1) {
						if (plateTypes[winners[j]] == "continental") {
							//console.log("REMOVE THE OCEANICS!")
							for (k = winnerCount; k > 0; k-=1) {
								if (plateTypes[winners[k]] == "oceanic") {
									//console.log("Removed plate " + winners[k])
									winners.splice(k, 1);
								};
							};
						};
					};
				};
				//console.log(winners);
				/* Get the plate sizes */
				tempSizes = Array.from(plateSizes);
				//console.log(tempSizes);	
				/* Eliminate sizes of non-winners */
				smallestPlate = 0;
				for (j = 0; j < plateCount; j+=1) {
					if (!winners.includes(j)) {
						tempSizes[j] = mapSize + 1;
					};
				};
				//console.log(tempSizes);
				/* Allocate tile to winner with lowest size (finally) */
				//console.log("Plate " + tempSizes.indexOf(Math.min.apply(null, tempSizes)) + " has won!");
				for (j = 0; j < plateCount; j+=1) {
					if (j !== tempSizes.indexOf(Math.min.apply(null, tempSizes))) {
						interPlate[j][i] = false;
					} else {
						interPlate[tempSizes.indexOf(Math.min.apply(null, tempSizes))][i] = true;
					};
				};
			};
		};
	};
	plates = interPlate;
	//console.log(plates);
	document.getElementById('round').innerHTML = "Round: " + round;
	render();
	console.log("Tiles Resolved!");
};

function moveResolve() {
	move();
	resolve();
};

/* Rendering Functions */

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
			square(column * tileSize, row * tileSize, colors.empty);
			//console.log("empty");
		};
		if (tileColor.length > 1) {
			square(column * tileSize, row * tileSize, colors.conflict);
			//console.log("conflict");
		};
		if (tileColor.length == 1) {
			if (plateCount > continentalColors.length) {
				if (plateTypes[tileColor[0]] == "continental") {
					square(column * tileSize, row * tileSize, colors.continental);
				} else {
					square(column * tileSize, row * tileSize, colors.oceanic);
				};
			} else {
				if (plateTypes[tileColor[0]] == "continental") {
					square(column * tileSize, row * tileSize, continentalColors[tileColor[0]]);
					//console.log("continental");
				};
				if (plateTypes[tileColor[0]] == "oceanic") {
					square(column * tileSize, row * tileSize, oceanicColors[tileColor[0]]);
					//console.log("oceanic");
				};
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
	/* Horizontal Boundaries */
	for (i = 0; i < plateCount; i+=1) {
		for (j = 0; j < mapSize; j+=1) {
			if ((j + 1) % mapWidth == 0) {
				if (plates[i][j] !== plates[i][j - mapWidth + 1]) {
					//console.log("hb");
					/* Go to top-right and draw down */
					line((j % mapWidth) * tileSize + tileSize, Math.floor(j / mapWidth) * tileSize, (j % mapWidth) * tileSize + tileSize, Math.floor(j / mapWidth) * tileSize + tileSize, boundaryWidth);
					/* Then go to left edge of map and draw down */
					line(0, Math.floor(j / mapWidth) * tileSize, 0, Math.floor(j / mapWidth) * tileSize + tileSize, boundaryWidth);
				} else {
					//console.log("nhb");
				};
			} else if (plates[i][j] !== plates[i][j + 1]) {
				//console.log("hb");
				/* Go to top-right and draw down */
				line((j % mapWidth) * tileSize + tileSize, Math.floor(j / mapWidth) * tileSize, (j % mapWidth) * tileSize + tileSize, Math.floor(j / mapWidth) * tileSize + tileSize, boundaryWidth);
			} else {
				//console.log("nhb");
			};
		};
	};
	/* Vertical Boundaries */
	for (i = 0; i < plateCount; i+=1) {
		for (j = 0; j < mapSize; j+=1) {
			if (j + mapWidth >= mapSize) {
				if (plates[i][j] !== plates[i][j - mapSize + mapWidth]) {
					//console.log("vb");
					/* Go to bottom-left and draw right */
					line((j % mapWidth) * tileSize, Math.floor(j / mapWidth) * tileSize + tileSize, (j % mapWidth) * tileSize + tileSize, Math.floor(j / mapWidth) * tileSize + tileSize, boundaryWidth);
					/* Then go to top edge of map and draw right */
					line((j % mapWidth) * tileSize, 0, (j % mapWidth) * tileSize + tileSize, 0, boundaryWidth);
				} else {
					//console.log("nvb");
				};
			} else if (plates[i][j] !== plates[i][j + mapWidth]) {
				//console.log("vb");
				/* Go to bottom-left and draw right */
				line((j % mapWidth) * tileSize, Math.floor(j / mapWidth) * tileSize + tileSize, (j % mapWidth) * tileSize + tileSize, Math.floor(j / mapWidth) * tileSize + tileSize, boundaryWidth);
			} else {
				//console.log("nvb");
			};
		};
	};
	//console.log("Lines drawn: " + lineCount);
};

/* Controls */

document.getElementById('gen3').addEventListener('click', gen3);
document.getElementById('gen2').addEventListener('click', gen2);
document.getElementById('genl').addEventListener('click', genL);
document.getElementById('genr').addEventListener('click', genR);
document.getElementById('move').addEventListener('click', move);
document.getElementById('resolve').addEventListener('click', resolve);
document.getElementById('fast').addEventListener('click', moveResolve);
