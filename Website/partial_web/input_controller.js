function setParameters()
{
	let rowsInput = document.getElementById("quantityRowInput");
	let colsInput = document.getElementById("quantityColInput");
	let cellWidthInput = document.getElementById("cellWidthInput");

	let readRows = parseInt(rowsInput.value,10);
	let readCols = parseInt(colsInput.value,10);
	let readWidth = parseInt(cellWidthInput.value,10);

	let errorDisplay = document.getElementById("errorDisplay");
		errorDisplay.innerHTML = "";

	if(readRows != NaN)
	{
		rows = readRows;
		let rowsDisplay = document.getElementById("rowsDisplay");
		//rowsDisplay.innerHTML = "#Rows: " + rows;
	}

	if(readCols != NaN)
	{
		cols = readCols;
		let colsDisplay = document.getElementById("colsDisplay");
		//colsDisplay.innerHTML = "#Cols: " + cols;
	}

	if(readWidth != NaN)
	{
		cellWidth = readWidth;
		let cellWidthDisplay = document.getElementById("cellWidthDisplay");
		//cellWidthDisplay.innerHTML = "CellWidth: " + cellWidth;
	}

	if(readRows != NaN && readCols != NaN && readWidth != NaN)
	{
		if(drawer != null && drawer.isRunning)
			drawer.stopDrawing();
		createBoard();
		createDrawer();
	}
}

function setDelay()
{
	let delayInput = document.getElementById("delayInput");
	let readDelay = parseInt(delayInput.value,10);

	let errorDisplay = document.getElementById("errorDisplay");
		errorDisplay.innerHTML = "";

	if(readDelay != NaN)
	{
		delay = readDelay;
		let delayDisplay = document.getElementById("delayDisplay");
		//delayDisplay.innerHTML = "Delay(Milliseconds): " + delay;
	}
}

function createBoard()
{

	let errorDisplay = document.getElementById("errorDisplay");
		errorDisplay.innerHTML = "";

	if(rows == null || cols == null)
	{
		let msg = "(createBoard)";
		msg += " THE #ROWS AND #COLS HAS NOT BEEN SET";
		console.log(msg);
	}
	else
	{
		board = new Board(rows,cols);
		console.log("The board is created");
	}
}

function setBoardInitFunction(initFunc, func_name)
{
	// let errorDisplay = document.getElementById("errorDisplay");
	// 	errorDisplay.innerHTML = "";


	if(board == null)
	{
		let msg = "(setBoardInitFunction)";
		msg += " THE BOARD HAS TO FIRST BE CREATED WITH SOME DIMENSIONS";
		console.log(msg);
	}
	else
	{
		initBoardFunc = initFunc;

		// let functionOutput = document.getElementById("functionInputArea");
		// functionOutput.value = "SOMETHING";

		console.log("The Board Init Function has been set to " + func_name);
		let initFuncDisplay = document.getElementById("initFuncDisplay");
		//initFuncDisplay.innerHTML = "InitBoard Function: " + func_name;
	}
}

function setCellUpdateFunction(updateFunc, func_name)
{
	// let errorDisplay = document.getElementById("errorDisplay");
	// 	errorDisplay.innerHTML = "";

	if(board == null)
	{
		let msg = "(setCellUpdateFunction)";
		msg += " THE BOARD HAS TO FIRST BE CREATED WITH SOME DIMENSIONS";
		console.log(msg);
	}
	else
	{
		updateCellFunc = updateFunc;

		// PAUSES AND SWAPS OUT THE UPDATE FUNCTION
		if(drawer.isRunning)
		{
			drawer.stopDrawing();
			board.setCellUpdate(updateCellFunc);
		}
		else if(board !== null)
		{
			board.setCellUpdate(updateCellFunc);
		}
		// PAUSES AND SWAPS OUT THE UPDATE FUNCTION

		console.log("The Cell Update Function has been set to " + func_name);
		let updateFuncDisplay = document.getElementById("updateFuncDisplay");
		//updateFuncDisplay.innerHTML = "UpdateCell Function: " + func_name;
	}
}

function createDrawer()
{
	if(board == null)
	{
		let msg = "(createDrawer)";
		msg += " THE BOARD HAS TO FIRST BE CREATED";
		console.log(msg);
	}
	else if(cellWidth == null)
	{
		let msg = "(createDrawer)";
		msg += " THE CELLWIDTH HAS TO BE SPECIFIED";
		console.log(msg);
	}
	else
		drawer = new Drawer(board,cellWidth);
}

function setDrawBoardFunction(drawFunc, func_name)
{
	let errorDisplay = document.getElementById("errorDisplay");
		errorDisplay.innerHTML = "";

	if(drawer == null)
	{
		let msg = "(setDrawBoardFunction)";
		msg += " THE DRAWER HAS TO FIRST BE CREATED WITH A BOARD ";
		console.log(msg);
	}
	else
	{
		drawBoardFunc = drawFunc;

		// PAUSES & SWAPS OUT THE DRAWING FUNCTION
		if(drawer.isRunning)
		{
			drawer.stopDrawing();
			drawer.setDrawBoard(drawBoardFunc);
		}
		else if(drawer !== null)
			drawer.setDrawBoard(drawBoardFunc);

		// PAUSES & SWAPS OUT THE DRAWING FUNCTION

		console.log("The Draw Board Function has been set to " + func_name);
		let updateFuncDisplay = document.getElementById("drawFuncDisplay");
		//drawFuncDisplay.innerHTML = "DrawBoard Function: " + func_name;
	}
}





function displayInitFunction()
{
	//to hide first div
	let functionEditingPart = document.getElementById("functionEditingPart");
	functionEditingPart.style.display = "none";

	let functionDisplay = document.getElementById("functionDisplay");
	functionDisplay.style.display = ""; 


	let functionOutput = document.getElementById("functionOutputArea");
	functionOutput.value = document.getElementById("pDisplayInit").innerHTML;
	
	let functionNameOutput =  document.getElementById("functionNameOutput");
	functionNameOutput.value = "gameOfLifeInitBoard";

    let tabDisplay = document.getElementById("changingDisplay");
	tabDisplay.style.visibility = "visible";
}


function displayCellUpdateGoL()
{
	let functionEditingPart = document.getElementById("functionEditingPart");
	functionEditingPart.style.display = "none";

	let functionDisplay = document.getElementById("functionDisplay");
	functionDisplay.style.display = ""; 
	let functionOutput = document.getElementById("functionOutputArea");
	functionOutput.value = document.getElementById("pDisplayUpdateCell").innerHTML;
	let functionNameOutput =  document.getElementById("functionNameOutput");
	functionNameOutput.value = "gameOfLifeUpdateCell";
	
    let tabDisplay = document.getElementById("changingDisplay");
	tabDisplay.style.visibility = "visible";
}

    
	
	






