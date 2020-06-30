'use strict';

// Simulation Variables

var mapWidth = 12;
var mapHeight = 12;
var initialPlateWidth = mapWidth / 3
var initialPlateHeight = mapHeight / 3

// Rendering Variables

var tileSize = 10
var borderWidth = 2
var boundaryWidth = 4

const tileColors = {
	"oceanic": "#4BF",
	"continental": "#9E4",
}

// Simulation Functions

function gen() {
	console.log("Generating Map")
};
function move() {
	console.log("Moving Plates")
};
function run() {
	console.log("Allocating Tiles")
};
function reset() {
	console.log("Resetting Map")
};

// Rendering Functions

// Buttons

document.getElementById('gen').addEventListener('click', gen);
document.getElementById('move').addEventListener('click', move);
document.getElementById('run').addEventListener('click', run);
document.getElementById('reset').addEventListener('click', reset);
