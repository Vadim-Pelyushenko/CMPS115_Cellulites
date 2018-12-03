// import * as board from './board.js'

// Global Variables
// var rows = null;
// var cols = null;
// var cellWidth = null;
var delay = null;

var board = null;
var drawer = null;

var initBoardFunc = null;
var updateCellFunc = null;
var drawBoardFunc = null;

export function runSimulation()
{
	board.setInitBoard(initBoardFunc);
	board.initializeBoard();
	board.setCellUpdate(updateCellFunc);

	drawer.setDrawBoard(drawBoardFunc);

	if(drawer.isRunning)
		drawer.stopDrawing();

	drawer.startDrawing(delay);
	drawer.frame = 0;
}

export function stopSimulation()
{
	drawer.stopDrawing();
}

export function resumeSimulation()
{
	drawer.resumeDrawing(delay);
}
