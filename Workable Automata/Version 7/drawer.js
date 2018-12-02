var TARGET_CANVAS_WIDTH = 150;

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
	//
	// data added with viewing system
	// ------------------------------------------------------------------------
	//
	// gridLineColor
	// The color of the grid lines on the simulator
	//
	// gridLinesOn
	// Boolean value that tells whether or not to draw the grid lines
	//
	// mouseIsDown
	// Boolean value, that tells whether or not the mouse is currently being held
	// on the simulator canvas
	//
	// targetState
	// Target state, when the user is editing the cells on the grid, their state
	// will be changed to this
	//
	// zoom_controller
	// The zoom controller, which controls the zooming on the canvas in terms of data,
	// and also manages the targetCanvas

	constructor(board, cellWidth)
	{
		this.board = board;
		this.cellWidth = cellWidth;

		// Creates the canvas and puts it on the document
		this.canv = document.getElementById("outputCanvas");
		if(this.canv === null)
		{
			this.canv = document.createElement("canvas");
			this.canv.setAttribute("id", "outputCanvas");	
			let outputTag = document.getElementById("output");
			outputTag.innerHTML = "";
			outputTag.appendChild(this.canv);
		}

		this.canv.width = board.cols*cellWidth;
		this.canv.height = board.rows*cellWidth;
		this.context = this.canv.getContext("2d");
		this.context.fillStyle = "#000000";
		this.context.fillRect(0,0,this.canv.width,this.canv.height);

		this.drawLoop = null;
		this.frame = 0;

		this.drawBoard = null;
		this.delay = null;
		this.isRunning = false;

		this.gridLineColor = "#66FF22";
		this.gridLinesOn = false;
		this.mouseIsDown = false;
		this.targetState = null;
		this.zoom_controller = new Zoom_Controller(this);
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
		if(this.drawLoop == null)
		{
			console.log("There is nothing being drawn right now");
		}
		else if(this.isRunning == false)
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

	// Methods added with the state changing tool
	drawGridLines()
	{
		if(!this.gridLinesOn)
			return;

		let canv = this.canv;
		let ctx = this.context;
		let zoom = this.zoom_controller;

		ctx.strokeStyle = this.gridLineColor;
		ctx.strokeRect(0,0,canv.width,canv.height);

		let numCols = zoom.rightColBound - zoom.leftColBound + 1;
		let numRows = zoom.bottomRowBound - zoom.topRowBound + 1;
		let wid = zoom.zoomCellWidth;

		for(let col = 0; col < numCols; col++)
		{
			ctx.beginPath();
			ctx.moveTo(col*wid,0);
			ctx.lineTo(col*wid,canv.height-1);
			ctx.stroke();
		}

		for(let row = 0; row < numRows; row++)
		{
			ctx.beginPath();
			ctx.moveTo(0,row*wid);
			ctx.lineTo(canv.width-1,row*wid);
			ctx.stroke();
		}
	}

	onMouseDown(evt)
	{
		this.mouseIsDown = true;
		this.targetState = document.getElementById("inputtedState").value.match(/[+-]?[0-9]+/g);
		for(let k = 0; k < this.targetState.length; k++)
			this.targetState[k] = parseInt(this.targetState[k]);

		this.onMouseMove(evt);
	}

	onMouseMove(evt)
	{
		if(!this.mouseIsDown)
			return;

		let coords = this.zoom_controller.computeCoords(evt);
		let cell = this.board.grid[coords.row][coords.col];

		let len = Math.min(cell.state.length,targetState.length);
		for(let k = 0; k < len; k++)
			cell.state[k] = targetState[k];

		this.drawBoard();
		this.drawGridLines();
	}

	onMouseUp(evt){this.mouseIsDown = false;}

	redrawAll()
	{
		if(this.drawBoard) // For testing right now
			this.drawBoard();
		this.drawGridLines();
		this.zoom_controller.targetRepaint();
	}
}

class Zoom_Controller
{
	// Data:
	//
	// drawer
	// The drawer that this Zoom_Controller is controlling
	//
	// zoomLevel
	// The zoom multiple. 2.7 means 270%
	//
	// zoomCellWidth
	// The width of each cell after the zooming is taken into account
	//
	// leftColBound
	// Index of leftmost column being drawn
	//
	// rightColBound
	// Index of rightmost column being drawn
	//
	// topRowBound
	// Index of topmost row being drawn
	//
	// bottomRowBound
	// Index of bottommost row being drawn
	//
	// targetCanvas
	// The canvas that is used to show the area being viewed on the output
	// canvas
	//
	// targetCTX
	// The context2d of the targetCanvas(for convenience)
	//
	// targetMouseDown
	// Boolean value, that tells whether or not the mouse is currently being
	// held on the target canvas
	//
	//
	constructor(dra)
	{
		this.drawer = dra;

		this.targetCanvas = document.getElementById("targetCanvas");
		if(this.targetCanvas === null)
		{
			this.targetCanvas = document.createElement("canvas");
			this.targetCanvas.setAttribute("id", "targetCanvas");
			let outputTag = document.getElementById("output");
			outputTag.appendChild(this.targetCanvas);
		}

		this.targetCTX = this.targetCanvas.getContext("2d");
		this.revalidate();
	}

	revalidate()
	{
		this.zoomLevel = 1;
		this.zoomCellWidth = this.drawer.cellWidth;
		this.leftColBound = 0;
		this.topRowBound = 0;
		this.rightColBound = this.drawer.board.cols - 1;
		this.bottomRowBound = this.drawer.board.rows - 1;

		let width = TARGET_CANVAS_WIDTH;
		let canv = this.drawer.canv;

		let largeSide = Math.max(canv.width,canv.height);
		this.targetCanvas.width = Math.floor(width*canv.width/largeSide);
		this.targetCanvas.height = Math.floor(width*canv.height/largeSide);
		this.zoomLevel = 1;
	}

	targetRepaint()
	{
		let dra = this.drawer;
		let targCanv = this.targetCanvas;
		let targCTX = this.targetCTX;

		targCTX.fillStyle = "#777777";
		targCTX.fillRect(0,0,targCanv.width,targCanv.height);

		let sectWidthRatio = (this.rightColBound - this.leftColBound + 1) / dra.board.cols;
		let sectHeightRatio = (this.bottomRowBound - this.topRowBound + 1) / dra.board.rows;

		let viewWidth = sectWidthRatio * targCanv.width;
		let viewHeight = sectHeightRatio * targCanv.height;

		let viewX = targCanv.width * this.leftColBound / dra.board.cols;
		let viewY = targCanv.height * this.topRowBound / dra.board.rows;

		targCTX.fillStyle = "#007777";
		console.log("BOUNDS:");
		console.log("ROW: " + this.topRowBound + ", " + this.bottomRowBound);
		console.log("COL: " + this.leftColBound + ", " + this.rightColBound);
		console.log("VIEW WIDTH: " + viewWidth);
		console.log("VIEW HEIGHT: " + viewHeight);
		console.log("VIEW COORDS: Row " + viewX + ", Col " + viewY);
		console.log(viewX + " " + viewY + " " + viewWidth + " " + viewHeight);
		targCTX.fillRect(viewX,viewY,viewWidth,viewHeight);
	}

	targOnMouseDown(evt){this.targetMouseDown = true;}

	targOnMouseUp(evt){this.targetMouseDown = false;}

	targOnMouseMove(evt) // DOCUMENTATE THIS PART
	{
		if(!this.targetMouseDown || this.zoomLevel === 1)
			return;

		let targCanv = this.targetCanvas;

		let mousePos = getMousePos(targCanv,evt);
		let ratioX = mousePos.x / targCanv.width;
		let ratioY = mousePos.y / targCanv.height;

		let sectWidth = this.rightColBound - this.leftColBound + 1;
		let sectHeight = this.bottomRowBound - this.topRowBound + 1;
		let sectWidthOff = Math.floor(sectWidth/2);
		let sectHeightOff = Math.floor(sectHeight/2);

		let cols = this.drawer.board.cols;
		let rows = this.drawer.board.rows;
		let colChange;
		let rowChange;

		let targCanvCellWid = targCanv.width / cols;

		if(sectWidth > cols)
		{
			colChange = 0;
			console.log(1);
		}
		else if(mousePos.x < sectWidthOff*targCanvCellWid)
			colChange = -this.leftColBound;
		else if(mousePos.x > targCanv.width - sectWidthOff*targCanvCellWid)
			colChange = (cols-1) - this.rightColBound
		else
			colChange = Math.ceil(ratioX * cols) - this.leftColBound - Math.floor(sectHeight/2);


		if(sectHeight > rows)
			rowChange = 0;
		else if(mousePos.y < sectHeightOff*targCanvCellWid)
			rowChange = -this.topRowBound;
		else if(mousePos.y > targCanv.height - sectHeightOff*targCanvCellWid)
			rowChange = (rows-1) - this.bottomRowBound;
		else
			rowChange = Math.ceil(ratioY * rows) - this.topRowBound - Math.floor(sectHeight/2);

		console.log("COL CHANGE: " + colChange + ", ROW CHANGE: " + rowChange);

		this.leftColBound += colChange;
		this.rightColBound += colChange;
		this.topRowBound += rowChange;
		this.bottomRowBound += rowChange;

		// if(this.leftColBound < 0)
		// {
		// 	console.log("MOUSE X: " + mousePos.x);
		// 	console.log("PREV LEFT COL: " + (this.leftColBound - colChange));
		// 	debugger;
		// }

		if(colChange != 0 || rowChange != 0)
			this.drawer.redrawAll();
	}

	zoomChange(amount){this.zoomSet(this.zoomLevel + amount);}

	zoomSet(amount)
	{
		if(amount < 1)
		{
			console.log("Can't zoom out further than 1");
			return;
		}

		this.zoomLevel = amount;
		console.log("New zoom level: " + this.zoomLevel);
		document.getElementById("zoomDisplay").innerHTML = this.zoomLevel;

		this.recomputeBounds();
	}

	recomputeBounds()
	{
		let canv = this.drawer.canv;
		let ctx = this.drawer.context;

		let rows = this.drawer.board.rows;
		let cols = this.drawer.board.cols;

		canv.width = cols * this.drawer.cellWidth;
		canv.height = rows * this.drawer.cellWidth;

		// calculates the center of the current view,
		// and the distance from the center to the edge of the view
		let midC = (this.leftColBound + this.rightColBound) / 2;
		let midR = (this.topRowBound + this.bottomRowBound) / 2;

		let sectOffset = Math.floor(Math.max(rows,cols)/this.zoomLevel/2);

		console.log("Previous bounds: ");
		console.log("Col: " + this.leftColBound + ", " + this.rightColBound);
		console.log("Row: " + this.topRowBound + ", " + this.bottomRowBound);

		this.leftColBound = Math.ceil(midC - sectOffset);
		this.rightColBound = Math.floor(midC + sectOffset);
		this.topRowBound = Math.ceil(midR - sectOffset);
		this.bottomRowBound = Math.floor(midR + sectOffset);

		let sectWidth = this.rightColBound - this.leftColBound + 1;
		let sectHeight = this.bottomRowBound - this.topRowBound + 1;
		let sectLength = Math.max(sectWidth,sectHeight);
		let normLength = Math.max(rows,cols);

		this.zoomCellWidth = this.drawer.cellWidth * (normLength / sectLength);

		console.log("New bounds before correction: ");
		console.log("Col: " + this.leftColBound + ", " + this.rightColBound);
		console.log("Row: " + this.topRowBound + ", " + this.bottomRowBound);

		// This code makes sure that the section of the grid being viewed
		// is within bounds.
		let colCorrect = 0;
		let rowCorrect = 0;

		if(this.leftColBound < 0)
			colCorrect = -this.leftColBound;
		else if(this.leftColBound > 0 && this.rightColBound > cols-1)
			colCorrect = -Math.min(this.leftColBound, this.rightColBound - (cols-1));

		if(this.topRowBound < 0)
			rowCorrect = -this.topRowBound;
		else if(this.topRowBound > 0 && this.bottomRowBound > rows-1)
			rowCorrect = -Math.min(this.topRowBound, this.bottomRowBound - (rows-1));

		console.log("Col correct: " + colCorrect);
		console.log("Row correct: " + rowCorrect);
		this.leftColBound += colCorrect;
		this.rightColBound += colCorrect;
		this.topRowBound += rowCorrect;
		this.bottomRowBound += rowCorrect;

		console.log("New bounds after correction:");
		console.log("Col: " + this.leftColBound + ", " + this.rightColBound);
		console.log("Row: " + this.topRowBound + ", " + this.bottomRowBound);

		// This code corrects the dimensions of the canvas so that it draws
		// the view properly(the dimensions become a square with more zooming)
		sectWidth = Math.min(this.rightColBound,cols-1) - this.leftColBound + 1;
		sectHeight = Math.min(this.bottomRowBound,rows-1) - this.topRowBound + 1;

		console.log("Section Width: " + sectWidth);
		console.log("Section Height: " + sectHeight);
		console.log("Zoom Width: " + this.zoomCellWidth);

		if(cols > rows && sectHeight * this.zoomCellWidth > canv.height)
		{
			this.zoomCellWidth = canv.height / sectHeight;
			canv.width = this.zoomCellWidth * sectWidth;
			console.log("Canvas width resized");
		}
		else if(rows > cols && sectWidth * this.zoomCellWidth > canv.width)
		{
			this.zoomCellWidth = canv.width / sectWidth;
			canv.height = this.zoomCellWidth * sectHeight;
			console.log("Canvas height resized");	
		}

		console.log("\n");
	}

	computeCoords(evt)
	{
		let mousePos = getMousePos(this.drawer.canv,evt);

		return {
			col: this.leftColBound + Math.floor(mousePos.x / this.zoomCellWidth),
			row: this.topRowBound + Math.floor(mousePos.y / this.zoomCellWidth)
		};
	}
}

// UTILITY
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------

function getMousePos(canvas,evt)
{
	let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function rgbToHex(red,green,blue)
{
	return "#" + singleValToHex(red) + singleValToHex(green) + singleValToHex(blue);
}

function singleValToHex(val)
{
	if(val == 0)
		return "00";
	else if(val < 16)
		return "0" + val.toString(16);
	else
		return val.toString(16);
}

function printGrid(grid)
{
	let result = "";

	for(let r = 0; r < grid.length; r++)
	{
		let line = "{";
		for(let c = 0; c < grid[r].length; c++)
		{
			line += "[" + grid[r][c] + "],";
		}
		line = line.substring(0,line.length-1);
		result += line + "},\n";
	}
	result = result.substring(0,result.length-2);

	return result;
}