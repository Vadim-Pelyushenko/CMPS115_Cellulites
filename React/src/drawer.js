class Drawer
{
	// Data:
	// 
	// board
	// Needs to be able to access the board to see the states of cells
	// 
	// cellWidth
	// The width(in pixels) of each cell
	// 
	// canv
	// The canvas that this Drawer will draw on
	// 
	// context
	// A graphics context that the Drawer uses to interact with the canvas directly.
	// This is how one normally draws on a canvas in Javascript
	// 
	// drawLoop
	// A function which draws frames every given interval of time.
	// 
	// frame
	// The frame number of the cellular automata. Tells how many times has it updated.
	// 
	// drawBoard
	// A function which can be swapped out. Describes how to draw the board, given a
	// grid of cells.
	//
	// delay
	// the current millisecond delay that the drawer is going by
	//
	// isRunning
	// true or false, says whether or not drawer is already drawing

	constructor(board, cellWidth)
	{
		this.board = board;
		this.cellWidth = cellWidth;

		// Creates the canvas and puts it on the document
		this.canv = document.createElement("canvas");
		let outputTag = document.getElementById("output");
		outputTag.innerHTML = "";
		outputTag.appendChild(this.canv);

		this.canv.width = board.rows*cellWidth;
		this.canv.height = board.cols*cellWidth;
		this.context = this.canv.getContext("2d");
		this.context.fillStyle = "#000000";
		this.context.fillRect(0,0,this.canv.width,this.canv.height);

		this.drawLoop = null;
		this.frame = 0;

		this.drawBoard = null;
		this.delay = null;
		this.isRunning = false;
	}

	startDrawing(delay)
	{
		this.delay = delay;
		if(this.drawBoard == null || !(typeof this.drawBoard === "function"))
		{
			let msg = "(startDrawing)";
			msg += " THE DRAWBOARD FUNCTION HAS NOT BEEN SET";
			console.log(msg);

			return;
		}

		// In order for the object context to still hold, bind is necessary
		this.drawFrame();
		if(this.board.randomizedUpdate)
		{
			console.log("Order of cell updates: Randomized");
			this.drawLoop = setInterval(this.drawRandomizedFrame.bind(this),delay);
		}
		else
		{
			console.log("Order of cell updates: Normal");
			this.drawLoop = setInterval(this.drawFrame.bind(this),delay);
		}

		this.isRunning = true;
		console.log("The interval is set");
	}

	stopDrawing()
	{
		if(this.drawLoop === null)
		{
			console.log("There is nothing being drawn right now");
		}
		else if(this.isRunning === false)
		{
			console.log("The Simulation is paused already");
		}
		else
		{
			console.log("Drawing has been stopped");
			clearInterval(this.drawLoop);
			this.isRunning = false;
		}
	}

	resumeDrawing(inDelay)
	{
		if(this.isRunning)
		{
			let msg = "(resumeDrawing)";
			msg += " THE SIMULATION IS NOT PAUSED, RESUMING REQUEST DENIED";
			console.log(msg);
		}
		else
		{
			this.delay = inDelay;
			this.startDrawing(this.delay);
			this.isRunning = true;
		}
	}

	setDrawBoard(drawFunc)
	{
		if(!(typeof drawFunc === "function"))
		{
			let msg = "(setDrawBoard)";
			msg += " THE VALUE SUPPLIED IS NOT A FUNCTION";
			console.log(msg);

			// DEBUGGING
			console.log("value supplied is of type: " + typeof drawFunc);

			return;
		}

		this.drawBoard = drawFunc.bind(this);
		console.log("drawBoard function has been successfully set");
	}

	// ONLY startDrawing() IS ALLOWED TO CALL THIS FUNCTION
	drawFrame()
	{
		console.log("current Frame: " + this.frame);
		this.frame++;

		this.drawBoard();
		this.board.updateBoard();
	}

	drawRandomizedFrame()
	{
		console.log("current Frame: " + this.frame);
		this.frame++;

		this.drawBoard();
		this.board.updateBoardRandomized();
	}

	// drawBoard()
	// {
	// 	let ctx = this.context;

	// 	ctx.fillStyle = "#000000"; // Set the color to black
	// 	ctx.fillRect(0,0,this.canv.width,this.canv.height);
		
	// 	ctx.fillStyle = "#FFFFFF";
	// 	for(let r = 0; r < this.board.rows; r++)
	// 	{
	// 		for(let c = 0; c < this.board.cols; c++)
	// 		{
	// 			if(this.board.grid[r][c] == 1)
	// 				ctx.fillRect(r*this.cellWidth,c*this.cellWidth,this.cellWidth,this.cellWidth);
	// 		}
	// 	}
	// }
}
