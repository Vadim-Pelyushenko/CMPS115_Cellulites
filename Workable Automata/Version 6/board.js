class Board
{
	// Data:
	// 
	// rows
	// The number of rows that there are
	//
	// cols
	// The number of columns that there are
	//
	// grid
	
	// The entire grid of cells
	//
	// initBoard
	// A function which can be swapped out. Describes how to initialize the states
	// of all the cells
	//
	// randomizedUpdate
	// a boolean value that determines whether or not to update the cells in a random order
	// false by default, but can be set to true or false

	constructor(rows, cols)
	{
		this.rows = rows;
		this.cols = cols;

		this.grid = null;
		this.initBoard = null;
		this.cellUpdate = null;
		this.randomizedUpdate = false;
	}

	setInitBoard(initFunc)
	{
		if(typeof initFunc === "function")
		{
			this.initBoard = initFunc.bind(this); // not sure if bind is necessary here, but just in case
			console.log("initBoard function has been successfully set");
		}
		else
		{
			let msg = "(setInitBoard)";
			msg += " THE VALUE SUPPLIED IS NOT A FUNCTION";
			console.log(msg);

			// DEBUGGING
			console.log("value supplied is of type: " + typeof initFunc);
		}
	}

	initializeBoard()
	{
		if(this.initBoard == null || !(typeof this.initBoard === "function"))
		{
			let msg = "(initializeBoard)";
			msg += " THE INITIALIZATION FUNCTION HAS NOT BEEN SET";
			console.log(msg);
		}
		else
		{
			this.initBoard();
			printGameOfLifeBoard(this.grid);
			console.log("board has been successfully initialized");
		}
	}

	setCellUpdate(updateFunc)
	{
		if(!(typeof updateFunc === "function"))
		{
			let msg = "(setCellUpdate)";
			msg += " THE VALUE SUPPLIED IS NOT A FUNCTION";
			console.log(msg);

			// DEBUGGING
			console.log("value supplied is of type: " + typeof updateFunc);
		}
		else
		{
			this.cellUpdate = updateFunc.bind(this);
			console.log("updateState has been successfully set for all of the cells");
		}
	}

	// setUpdate(updateFunc)
	// {
	// 	if(typeof updateFunc === "function")
	// 		this.update = updateFunc.bind(this); // not sure if bind is necessary here, but just in case
	// 	else
	// 	{
	// 		let msg = "(setUpdate)";
	// 		msg += " THE VALUE SUPPLIED IS NOT A FUNCTION";
	// 		console.log(msg);
	// 	}
	// }

	setRandomized(value)
	{
		if(typeof(value) === "boolean")
			this.randomizedUpdate = value;
		else
		{
			let msg = "(setRandomized)";
			msg += " THE VALUE SUPPLIED IS NOT A BOOLEAN";
			console.log(msg);
		}
	}

	// Updates the board using the set updateStates
	updateBoard()
	{
		if(this.initBoard == null || !(typeof this.initBoard === "function"))
		{
			let msg = "(updateBoard)";
			msg += " THE CELL UPDATE FUNCTION HAS NOT BEEN SET";
			console.log(msg);
			return;
		}

		for(let r = 0; r < this.rows; r++)
		{
			for(let c = 0; c < this.cols; c++)
			{
				this.cellUpdate(r,c);
			}
		}

		// Set all of the cells to their futureStates
		for(let r = 0; r < this.rows; r++)
		{
			for(let c = 0; c < this.cols; c++)
			{
				this.grid[r][c].nextGeneration();
			}
		}
	}

	updateBoardRandomized()
	{
		if(this.initBoard == null || !(typeof this.initBoard === "function"))
		{
			let msg = "(updateBoard)";
			msg += " THE CELL UPDATE FUNCTION HAS NOT BEEN SET";
			console.log(msg);
			return;
		}

		let totalElements = this.rows*this.cols;
		let orderPosR = new Array(totalElements);
		let orderPosC = new Array(totalElements);
		randomizeOrder(totalElements,this.rows,this.cols,orderPosR,orderPosC);

		for(let i = 0; i < totalElements; i++)
		{
			let r = orderPosR[i];
			let c = orderPosC[i];
			this.cellUpdate(r,c);
		}

		// Set all of the cells to their futureStates
		for(let r = 0; r < this.rows; r++)
		{
			for(let c = 0; c < this.cols; c++)
			{
				this.grid[r][c].nextGeneration();
			}
		}
	}
}


//---------------------------------------------------------------
// Utility functions

function create2DArray(rows, cols)
{
	let result = new Array(rows);

	for(let r = 0; r < rows; r++)
	{
		result[r] = new Array(cols);
	}

	return result;
}

function randomizeOrder(numValues,rows,cols,posR,posC,)
{
	let currRow = 0;
	let count = 0;
	for(let i = 0; i < numValues; i++)
	{
		posR[i] = currRow;
		posC[i] = count;
		count++;

		if(count == cols)
		{
			currRow++;
			count = 0;
		}
	}

	let temp;
	for(let n = numValues; n > 1; n--)
	{
		let choice = Math.floor(Math.random()*n);

		temp = posR[n-1];
		posR[n-1] = posR[choice];
		posR[choice] = temp;

		temp = posC[n-1];
		posC[n-1] = posC[choice];
		posC[choice] = temp;
	}
}

// For Debugging
function printGameOfLifeBoard(grid)
{
	let rows = grid.length;
	let cols = grid[0].length;

	console.log("The board:");
	for(let r = 0; r < rows; r++)
	{
		let result = "";
		for(let c = 0; c < cols; c++)
		{
			let state = grid[r][c].state;

			result += "[" + state[0];
			for(let ind = 1; ind < state.length; ind++)
			{
				result += " " + state[ind];
			}
			result += "] ";
		}
		console.log(r + " " + result + "ROWEND");
	}
}

function printGameOfLifeTempBoard(grid)
{
	console.log("The futureState of the board");
	let rows = grid.length;
	let cols = grid[0].length;

	console.log("The board:");
	for(let r = 0; r < rows; r++)
	{
		let result = "";
		for(let c = 0; c < cols; c++)
		{
			let state = grid[r][c].futureState;

			result += "[" + state[0];
			for(let ind = 1; ind < state.length; ind++)
			{
				result += " " + state[ind];
			}
			result += "] ";
		}
		console.log(r + " " + result + "ROWEND");
	}
}