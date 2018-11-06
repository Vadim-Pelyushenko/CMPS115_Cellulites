// Global Variables
var rows = null;
var cols = null;
var cellWidth = null;
var delay = null;

var board = null;
var drawer = null;

function runSimulation()
{
	board.initializeBoard();

	if(!drawer.isRunning)
	{
		drawer.startDrawing(delay);
		drawer.frame = 0;
	}
}

function stopSimulation()
{
	drawer.stopDrawing();
}

function resumeSimulation()
{
	drawer.resumeDrawing(delay);
}