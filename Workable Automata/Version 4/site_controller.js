// Global Variables
var rows = null;
var cols = null;
var cellWidth = null;
var delay = null;

var board = null;
var drawer = null;

var initBoardFunc = null;
var updateCellFunc = null;
var drawBoardFunc = null;

var confirmedInitBoardText = null;
var confirmedUpdateCellText = null;
var confirmedDrawBoardText = null;

var confirmedInitBoardFuncName = null;
var confirmedUpdateCellFuncName = null;
var confirmedDrawBoardFuncName = null;

var selectedFunction = null;

function runSimulation()
{
	if(initBoardFunc == null || updateCellFunc == null || drawBoardFunc == null)
	{
		console.log("NOT ALL OF THE FUNCTIONS HAVE BEEN SET. CANNOT START SIMULATION");
		return;
	}

	board.setInitBoard(initBoardFunc);
	board.initializeBoard();
	board.setCellUpdate(updateCellFunc);

	drawer.setDrawBoard(drawBoardFunc);

	if(drawer.isRunning)
		drawer.stopDrawing();

	drawer.startDrawing(delay);
	drawer.frame = 0;
}

function stopSimulation()
{
	drawer.stopDrawing();
}

function resumeSimulation()
{
	drawer.resumeDrawing(delay);
}

function select_Event(e)
{
	let functionEditing = document.getElementById("functionEditingPart");
	let functionArea = document.getElementById("functionInputArea");
	let functionNameInput = document.getElementById("functionNameInput");

	if(e.value === "nothing")
	{
		functionEditing.style.display = "none"; // hide the function editing part
		selectedFunction = null;
		console.log("You are not writing to any function");
		return;
	}
	
	selectedFunction = e.value;
	functionEditing.style.display = ""; // unhide the function editing part

	if(e.value === "initBoard")
	{
		console.log("You are writing the initialization function");
		if(confirmedInitBoardText !== null)
		{
			functionArea.value = confirmedInitBoardText;
			functionNameInput.value = confirmedInitBoardFuncName;
		}
		else
		{
			functionArea.value = "";
			functionNameInput.value = "";
		}
	}
	else if(e.value === "updateCell")
	{
		console.log("You are writing the cell update function");
		if(confirmedUpdateCellText !== null)
		{
			functionArea.value = confirmedUpdateCellText;
			functionNameInput.value = confirmedUpdateCellFuncName;
		}
		else
		{
			functionArea.value = "";
			functionNameInput.value = "";
		}
	}
	else if(e.value === "drawBoard")
	{
		console.log("You are writing the cell drawing function");
		if(confirmedDrawBoardText !== null)
		{
			functionArea.value = confirmedDrawBoardText;
			functionNameInput.value = confirmedDrawBoardFuncName;
		}
		else
		{
			functionArea.value = "";
			functionNameInput.value = "";
		}
	}

	// let check = document.getElementById("functionInputArea");
	// console.log("\"" + check.style.display + "\"");
}

function confirmCode()
{
	let functionInput = document.getElementById("functionInputArea");
	let functionNameInput = document.getElementById("functionNameInput");
	let rawCode = functionInput.value;
	let func_name = functionNameInput.value;

	var compiledFunction;

	if(selectedFunction === "initBoard")
	{
		confirmedInitBoardText = rawCode;
		confirmedInitBoardFuncName = func_name;
		eval("compiledFunction = " + rawCode + ";");
		setBoardInitFunction(compiledFunction,func_name);
	}
	else if(selectedFunction === "updateCell")
	{
		confirmedUpdateCellText = rawCode;
		confirmedUpdateCellFuncName = func_name;
		eval("compiledFunction = " + rawCode + ";");
		setCellUpdateFunction(compiledFunction,func_name);
	}
	else if(selectedFunction === "drawBoard")
	{
		confirmedDrawBoardText = rawCode;
		confirmedDrawBoardFuncName = func_name;
		eval("compiledFunction = " + rawCode + ";");
		setDrawBoardFunction(compiledFunction,func_name);
	}
}