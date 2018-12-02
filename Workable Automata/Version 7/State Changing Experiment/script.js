var rows;
var cols;
var cellWidth;
var gridColor;
var grid;
var editGridStatus;

var zoomLevel = 1.0;
var zoomCellWidth;
var zoomLeftColBound;
var zoomRightColBound;
var zoomTopRowBound;
var zoomBottomRowBound;

var mouseIsDown = false;

var canv = document.getElementById("targetCanvas");
canv.addEventListener("onmousedown",function(){mouseIsDown = true;});
canv.addEventListener("onmouseup",resetToggling);
var ctx = canv.getContext("2d");

changeParams();


function changeParams()
{
	rows = parseInt(document.getElementById("rowInput").value);
	cols = parseInt(document.getElementById("colInput").value);
	cellWidth = parseInt(document.getElementById("widthInput").value);
	gridColor = document.getElementById("gridColorInput").value;

	zoomCellWidth = cellWidth;
	zoomLeftColBound = 0;
	zoomRightColBound = Math.max(cols-1,rows-1);
	zoomTopRowBound = 0;
	zoomBottomRowBound = Math.max(cols-1,rows-1);

	canv.width = cols*cellWidth;
	canv.height = rows*cellWidth;

	constructBoard();
	drawBoard();
	drawGrid();
}


//https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_onmousemove
function mouseDown(evt)
{
	let mousePos = getMousePos(canv,evt);
	console.log("Coordinates: " + mousePos.x + ", " + mousePos.y);
	let col = zoomLeftColBound + Math.floor(mousePos.x / zoomCellWidth);
	let row = zoomTopRowBound + Math.floor(mousePos.y / zoomCellWidth);
	console.log("Row: " + row + ", Col: " + col);

	mouseIsDown = true;
	grid[row][col] = 2 - grid[row][col];
	editGridStatus[row][col] = 1;
	drawBoard();
	drawGrid();
}

// https://www.w3schools.com/jsref/event_onmouseup.asp
function handleToggle(evt)
{
	if(!mouseIsDown)
		return;

	let mousePos = getMousePos(canv,evt);
	console.log("Coordinates: " + mousePos.x + ", " + mousePos.y);
	let col = zoomLeftColBound + Math.floor(mousePos.x / zoomCellWidth);
	let row = zoomTopRowBound + Math.floor(mousePos.y / zoomCellWidth);
	console.log("Row: " + row + ", Col: " + col);

	if(editGridStatus[row][col] == 1)
		return;

	grid[row][col] = 2 - grid[row][col];
	console.log("toggled");
	editGridStatus[row][col] = 1;

	drawBoard();
	drawGrid();
}

// https://www.w3schools.com/jsref/event_onmouseup.asp
function resetToggling()
{
	for(let r = 0; r < editGridStatus.length; r++)
		for(let c = 0; c < editGridStatus[r].length; c++)
			editGridStatus[r][c] = 0;

	mouseIsDown = false;
}

function getMousePos(canvas,evt)
{
	let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function drawGrid()
{
	ctx.strokeStyle = gridColor;
	ctx.strokeRect(0,0,canv.width,canv.height);
	// console.log("Drawing The Grid");
	// console.log("cols: " + cols + ", rows: " + rows);
	// console.log("cellWidth: " + cellWidth);
	// console.log("grid color: " + gridColor + "\n\n");

	let cWidth = zoomCellWidth;

	for(let col = 0; col <= (zoomRightColBound - zoomLeftColBound); col++)
	{
		ctx.beginPath();
		ctx.moveTo(col*cWidth,0);
		ctx.lineTo(col*cWidth,canv.height-1);
		ctx.stroke();
	}

	for(let row = 0; row <= (zoomBottomRowBound - zoomTopRowBound); row++)
	{
		ctx.beginPath();
		ctx.moveTo(0,row*cWidth);
		ctx.lineTo(canv.width-1,row*cWidth);
		ctx.stroke();
	}
}

function constructBoard()
{
	grid = new Array(rows);
	editGridStatus = new Array(rows);

	for(let k = 0; k < rows; k++)
	{
		grid[k] = new Array(cols);
		editGridStatus[k] = new Array(cols);

		for(let c = 0; c < cols; c++)
		{
			grid[k][c] = 0;
			editGridStatus[k][c] = 0;
			// grid[k][c] = Math.floor(Math.random()*2);
		}
	}

	// grid[0][0] = 1;
}

function drawBoard()
{
	ctx.fillStyle = "#777777";
	ctx.fillRect(0,0,canv.width,canv.width);

	let rowBegin = zoomTopRowBound;
	let colBegin = zoomLeftColBound;
	let rowEnd = Math.min(zoomBottomRowBound,rows-1);
	let colEnd = Math.min(zoomRightColBound,cols-1);
	let cWidth = zoomCellWidth;

	// canv.width = cWidth * (rowEnd - rowBegin + 1);
	// canv.height = cWidth * (colEnd - colBegin + 1);

	for(let r = rowBegin; r <= rowEnd; r++)
	{
		for(let c = colBegin; c <= colEnd; c++)
		{
			let val = grid[r][c];

			// if(val === 0)
			// 	ctx.fillStyle = "#FFFFFF";
			// else if(val === 1)
			// 	ctx.fillStyle = "#000000";
			// else
			// 	ctx.fillStyle = "#006600";

			let redAmount = Math.floor(r*(255/(rows-1)));
			let greAmount = Math.floor(c*(255/(cols-1)));
			ctx.fillStyle = rgbToHex(redAmount,greAmount,0);

			if(r == 0 || r == rows-1 || c == 0 || c == cols-1)
				ctx.fillStyle = "#0000FF";

			if(r == c)
				ctx.fillStyle = "#FFFFFF";
			if(r == (cols-1) - c)
				ctx.fillStyle = "#FF00FF";

			if(val == 2)
				ctx.fillStyle = "#777777";

			ctx.fillRect((c-colBegin)*cWidth,(r-rowBegin)*cWidth,cWidth,cWidth);
		}
	}
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

// --------------------------------------------------------------

function zoomChange(amount)
{
	console.log("changing zoom");
	if(zoomLevel + amount >= 1)
		zoomLevel += amount;
	else
	{
		console.log("Can't zoom out further than 1");
		return;
	}
	console.log("new zoom level: " + zoomLevel);

	document.getElementById("zoomDisplay").innerHTML = zoomLevel;

	recomputeBounds();
}

function recomputeBounds()
{
	let midC = (zoomLeftColBound + zoomRightColBound) / 2;
	let midR = (zoomTopRowBound + zoomBottomRowBound) / 2;
	let zoomOffset = Math.floor(Math.max(rows,cols)/zoomLevel/2);

	console.log("Previous bounds: ");
	console.log("Col: " + zoomLeftColBound + ", " + zoomRightColBound);
	console.log("Row: " + zoomTopRowBound + ", " + zoomBottomRowBound);

	zoomLeftColBound = Math.ceil(midC - zoomOffset);
	zoomRightColBound = Math.floor(midC + zoomOffset);
	zoomTopRowBound = Math.ceil(midR - zoomOffset);
	zoomBottomRowBound = Math.floor(midR + zoomOffset);
	
	let sectionWidth = zoomRightColBound - zoomLeftColBound + 1;
	let sectionHeight = zoomBottomRowBound - zoomTopRowBound + 1;
	let sectionLength = Math.max(sectionWidth,sectionHeight);
	let normalLength = Math.max(rows,cols);

	console.log(normalLength/sectionLength);
	zoomCellWidth = cellWidth*(normalLength/sectionLength);
	console.log("NOTE: " + zoomCellWidth);



	console.log("New bounds before correction: ");
	console.log("Col: " + zoomLeftColBound + ", " + zoomRightColBound);
	console.log("Row: " + zoomTopRowBound + ", " + zoomBottomRowBound);

	if(zoomLeftColBound < 0)
	{
		zoomRightColBound += (-zoomLeftColBound);
		zoomLeftColBound = 0;
	}
	else if(zoomLeftColBound > 0 && zoomRightColBound > cols-1)
	{
		let shift = Math.min(zoomLeftColBound,zoomRightColBound - (cols-1));
		zoomLeftColBound -= shift;
		zoomRightColBound -= shift;
	}

	if(zoomTopRowBound < 0)
	{
		zoomBottomRowBound += (-zoomTopRowBound);
		zoomTopRowBound = 0;
	}
	else if(zoomTopRowBound > 0 && zoomBottomRowBound > rows-1)
	{
		let shift = Math.min(zoomTopRowBound,zoomBottomRowBound - (rows-1));
		zoomTopRowBound -= shift;
		zoomBottomRowBound -= shift;
	}

	console.log("New bounds after correction:");
	console.log("Col: " + zoomLeftColBound + ", " + zoomRightColBound);
	console.log("Row: " + zoomTopRowBound + ", " + zoomBottomRowBound);
	console.log("\n");

	drawBoard();
	drawGrid();
}


// UTILITY
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------

function rgbToHex(red,green,blue)
{
	// console.log("calculating color:");
	// console.log("\tRed: " + red + " -> " + singleValToHex(red));
	// console.log("\tGreen:" + green + " -> " + singleValToHex(green));
	// console.log("\tBlue:" + blue + " -> " + singleValToHex(blue));
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