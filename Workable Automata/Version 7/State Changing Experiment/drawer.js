var TARGET_CANVAS_WIDTH = 150;

class Drawer
{
	// Data:
	//
	// canv
	// The canvas that the drawer is drawing on
	//
	// ctx
	// The context2d of the canvas being drawn on(for convenience)
	//
	// board
	// placeHolder
	//
	// rows
	// The number of rows that there are
	//
	// cols
	// The number of columns that there are
	//
	// cellWidth
	// The pixel width of each cell
	//
	// gridLineColor
	// The color of the grid lines
	//
	// mouseIsDown
	// Boolean value, that tells whether or not the mouse is currently being
	// held on the canvas
	//
	// targetState
	// Target state, when the user is editing the cells on the grid, their state
	// will be changed to this
	//
	// zoom_controller
	// The zoom controller, which controls the zooming on the canvas

	constructor(rows,cols,cellWidth,gridLineColor)
	{
		this.canv = document.getElementById("outputCanvas");
		this.ctx = this.canv.getContext("2d");

		this.rows = rows;
		this.cols = cols;
		this.cellWidth = cellWidth;
		this.gridLineColor = gridLineColor;
		this.board = constructBoard(this.rows,this.cols);
		this.mouseIsDown = false;

		this.canv.width = cols*cellWidth;
		this.canv.height = rows*cellWidth;

		this.zoom_controller = new Zoom_Controller(this);
	}

	// http://pietschsoft.com/post/2008/10/14/JavaScript-Gem-Null-Coalescing-using-the-OR-Operator
	change_parameters(rows,cols,cellWidth,gridLineColor)
	{
		this.rows = rows || this.rows;
		this.cols = cols || this.cols;
		this.cellWidth = cellWidth || this.cellWidth;
		this.gridLineColor = gridLineColor || this.gridLineColor;
		this.board = constructBoard(this.rows,this.cols);
		this.mouseIsDown = false;

		this.canv.width = cols*cellWidth;
		this.canv.height = rows*cellWidth;

		this.zoom_controller.revalidate();
	}

	drawBoard()
	{
		let canv = this.canv;
		let ctx = this.ctx;
		let zoom = this.zoom_controller;

		ctx.fillStyle = "#777777";
		ctx.fillRect(0,0,canv.width,canv.width);

		let rowBegin = zoom.topRowBound;
		let colBegin = zoom.leftColBound;
		let rowEnd = Math.min(zoom.bottomRowBound,rows-1);
		let colEnd = Math.min(zoom.rightColBound,cols-1);
		let wid = zoom.zoomCellWidth;

		for(let r = rowBegin; r <= rowEnd; r++)
		{
			for(let c = colBegin; c <= colEnd; c++)
			{
				let val = this.board[r][c];

				let red = Math.floor(r*(255/(rows-1)));
				let gre = Math.floor(c*(255/(cols-1)));
				ctx.fillStyle = rgbToHex(red,gre,0);

				if(val == 2)
					ctx.fillStyle = "#777777";
				else if(r == (cols-1) - c)
					ctx.fillStyle = "#FF00FF";
				else if(r == c)
					ctx.fillStyle = "#FFFFFF";
				else if(r == 0 || r == rows-1 || c == 0 || c == cols-1)
					ctx.fillStyle = "#0000FF";

				ctx.fillRect((c-colBegin)*wid,(r-rowBegin)*wid,wid,wid);
			}
		}

		this.drawGridLines();
	}

	drawCell(r,c)
	{
		let canv = this.canv;
		let ctx = this.ctx;
		let zoom = this.zoom_controller;

		let rowBegin = zoom.topRowBound;
		let colBegin = zoom.leftColBound;
		let wid = zoom.zoomCellWidth;

		let val = this.board[r][c];

		let red = Math.floor(r*(255/(rows-1)));
		let gre = Math.floor(c*(255/(cols-1)));
		ctx.fillStyle = rgbToHex(red,gre,0);

		if(val == 2)
			ctx.fillStyle = "#777777";
		else if(r == (cols-1) - c)
			ctx.fillStyle = "#FF00FF";
		else if(r == c)
			ctx.fillStyle = "#FFFFFF";
		else if(r == 0 || r == rows-1 || c == 0 || c == cols-1)
			ctx.fillStyle = "#0000FF";

		ctx.fillRect((c-colBegin)*wid+1,(r-rowBegin)*wid+1,wid-2,wid-2);
	}

	drawGridLines()
	{
		let canv = this.canv;
		let ctx = this.ctx;
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
		this.board[coords.row][coords.col] = this.targetState[0]; // Will be changed in integration

		this.drawCell(coords.row,coords.col);
		// this.drawGridLines();
	}

	onMouseUp(evt){this.mouseIsDown = false;}

	redrawAll()
	{
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
		this.targetCTX = this.targetCanvas.getContext("2d");

		this.revalidate();
	}

	targetRepaint()
	{
		let dra = this.drawer;
		let targCanv = this.targetCanvas;
		let targCTX = this.targetCTX;

		targCTX.fillStyle = "#777777";
		targCTX.fillRect(0,0,targCanv.width,targCanv.height);

		let sectionWidthRatio = (this.rightColBound - this.leftColBound + 1) / dra.cols;
		let sectionHeightRatio = (this.bottomRowBound - this.topRowBound + 1) / dra.rows;

		let viewWidth = sectionWidthRatio * targCanv.width;
		let viewHeight = sectionHeightRatio * targCanv.height;

		let viewX = targCanv.width * this.leftColBound / dra.cols;
		let viewY = targCanv.height * this.topRowBound / dra.rows;

		targCTX.fillStyle = "#007777";
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


		let cols = this.drawer.cols;
		let rows = this.drawer.rows;
		let colChange;
		let rowChange;

		let targCanvCellWid = targCanv.width / cols;

		if(sectWidth > cols)
			colChange = 0;
		else if(mousePos.x < sectWidthOff*targCanvCellWid)
			colChange = -this.leftColBound;
		else if(mousePos.x > targCanv.width - sectWidthOff*targCanvCellWid)
			colChange = (cols-1) - this.rightColBound;
		else
			colChange = Math.ceil(ratioX*cols) - this.leftColBound - Math.floor(sectWidth/2);

		if(sectHeight > rows)		
			rowChange = 0;
		else if(mousePos.y < sectHeightOff*targCanvCellWid)
			rowChange = -this.topRowBound;
		else if(mousePos.y > targCanv.height - sectHeightOff*targCanvCellWid)
			rowChange = (rows-1) - this.bottomRowBound;
		else
			rowChange = Math.ceil(ratioY * rows) - this.topRowBound - Math.floor(sectHeight/2);

		this.leftColBound += colChange;
		this.rightColBound += colChange;
		this.topRowBound += rowChange;
		this.bottomRowBound += rowChange;

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
		let ctx = this.drawer.ctx;

		let rows = this.drawer.rows;
		let cols = this.drawer.cols;
		let cellWidth = this.zoomCellWidth;

		canv.width = cols * this.drawer.cellWidth;
		canv.height = rows * this.drawer.cellWidth;

		// calculates the center of the current view, 
		// and the distance from the center to the edge of the view
		let midC = (this.leftColBound + this.rightColBound) / 2;
		let midR = (this.topRowBound + this.bottomRowBound) / 2;

		console.log(rows + " " + cols + " " + this.zoomLevel);
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

	revalidate()
	{
		this.zoomLevel = 1;
		this.zoomCellWidth = this.drawer.cellWidth;
		this.leftColBound = 0;
		this.topRowBound = 0;
		this.rightColBound = this.drawer.cols - 1;
		this.bottomRowBound = this.drawer.rows - 1;

		let width = TARGET_CANVAS_WIDTH;
		let canv = this.drawer.canv;

		let largeSide = Math.max(canv.width,canv.height);
		this.targetCanvas.width = Math.floor(width*canv.width/largeSide);
		this.targetCanvas.height = Math.floor(width*canv.height/largeSide);
		this.zoomLevel = 1;
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

function constructBoard(rows,cols)
{
	let result = new Array(rows);

	for(let r = 0; r < rows; r++)
	{
		result[r] = new Array(cols);
		for(let c = 0; c < cols; c++)
			result[r][c] = 0;
	}

	return result;
}

function printGrid()
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