'use strict';

// Simulation Variables

var mapWidth = 12;
var mapHeight = 12;
var mapSize = mapWidth * mapHeight;
var row = 0;
var column = 0;
var plateCount = 9;
var initialPlateWidth = mapWidth / 3;
var initialPlateHeight = mapHeight / 3;
var plateAttributes = [];
var plates = [];
var tileAttributes = [];
var i;
var j;

// Rendering Variables

var canvas = document.getElementById("art");
var ctx = art.getContext("2d");
var tileSize = 40;
var borderWidth = 3;
var boundaryWidth = 6;
var colors = {
	border:"#333",
	boundary:"#000",
	oceanic:"#4BF",
	continental:"#9E4",
};

// Simulation Functions

function gen() {
	console.log("Generating Map...");
	plateAttributes = [];
	for (i = 0; i < 9; i+=1) {
		if (i >= plateCount) {
			plateAttributes.push("empty");
		} else {
			var choice; 
			choice = Math.floor(Math.random() * 3);
			if (choice == 0) {
				plateAttributes.push("continental");
			} else {
				plateAttributes.push("oceanic");
			}
		}
	};
	console.log(plateAttributes);
	plates = [];
	for (i = 0; i < 9; i+=1) {
		plates.push([]);
	}
	for (i = 0; i < 9; i+=1) {
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
	drawGrid();
	drawBoundaries();
	//line(40, 0, 40, 40, 6);
	//line(40, 40, 80, 40, 6);
	//line(80, 40, 80, 0, 6);
	//line(40, 0, 80, 0, 6);
	console.log("Map Generated!");
};
function genSquarePlate(plate, offset) {
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
	for (i = offset + 28; i < mapSize; i+=1) {
		plates[plate][i] = false;
	};
};
function move() {
	console.log("Moving Plates...");
	console.log("There is nothing to move yet.");
};
function resolve() {
	console.log("Allocating Tiles...");
	console.log("There is nothing to allocate yet.");
};

// Rendering Functions

function line(sx, sy, ex, ey, t) {
	ctx.strokeStyle = colors.boundary;
	ctx.lineCap = "square";
	ctx.lineWidth = t;
	ctx.moveTo(sx,sy);
	ctx.lineTo(ex,ey);
	ctx.stroke()
};
function square(sx, sy, t) {
	ctx.strokeStyle = colors.border;
	ctx.lineWidth = t;
	ctx.strokeRect(sx, sy, tileSize, tileSize)
};
function drawGrid() {
	ctx.clearRect(0, 0, mapWidth, mapHeight)
	var row = 0;
	var column = 0;
	for (i = 0; i < mapSize; i+=1) {
		square(row * tileSize, column * tileSize, borderWidth);
		row += 1;
		if (row >= mapWidth) {
			column += 1;
			row = 0
		}
	}
};
function drawBoundaries() {
	// will be added later
};

// Buttons

document.getElementById('gen').addEventListener('click', gen);
document.getElementById('move').addEventListener('click', move);
document.getElementById('resolve').addEventListener('click', resolve);
