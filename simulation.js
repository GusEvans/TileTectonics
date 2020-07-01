'use strict';

// Simulation Variables

var mapWidth = 12;
var mapHeight = 12;
var mapSize = mapWidth * mapHeight;
var row = 0;
var column = 0;
var initialPlateWidth = mapWidth / 3;
var initialPlateHeight = mapHeight / 3;
var tiles = [];
var plates = [];

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
	drawGrid();
	drawBoundaries();
	line(40, 0, 40, 40, 6);
	line(40, 40, 80, 40, 6);
	line(80, 40, 80, 0, 6);
	line(40, 0, 80, 0, 6);
	console.log("Map Generated!");
};
function move() {
	console.log("Moving Plates...");
};
function resolve() {
	console.log("Allocating Tiles...");
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
	var i;
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
