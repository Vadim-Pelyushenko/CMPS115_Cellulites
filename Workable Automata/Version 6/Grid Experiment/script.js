var rows;
var cols;
var cellWidth;
var gridColor;
var grid;

var canv = document.getElementById("targetCanvas");
canv.addEventListener("click",handleClick);
var ctx = canv.getContext("2d");

changeParams();


function changeParams()
{
	rows = parseInt(document.getElementById("rowInput").value);
	cols = parseInt(document.getElementById("colInput").value);
	cellWidth = parseInt(document.getElementById("widthInput").value);
	gridColor = document.getElementById("gridColorInput").value;

	canv.width = cols*cellWidth;
	canv.height = rows*cellWidth;

	constructGrid();
	drawBoard();
	drawGrid();
}

function handleClick(evt)
{
	let mousePos = getMousePos(canv,evt);
	console.log("Coordinates: " + mousePos.x + ", " + mousePos.y);
	let col = Math.floor(mousePos.x / cellWidth);
	let row = Math.floor(mousePos.y / cellWidth);
	console.log("Row: " + row + ", Col: " + col);

	grid[row][col] = 1 - grid[row][col];
	console.log("toggled");

	drawBoard();
	drawGrid();

	console.log();
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
	console.log("Drawing The Grid");
	console.log("cols: " + cols + ", rows: " + rows);
	console.log("cellWidth: " + cellWidth);
	console.log("grid color: " + gridColor + "\n\n");

	for(let col = 0; col < cols; col++)
	{
		ctx.beginPath();
		ctx.moveTo(col*cellWidth,0);
		ctx.lineTo(col*cellWidth,canv.height-1);
		ctx.stroke();
	}

	for(let row = 0; row < rows; row++)
	{
		ctx.beginPath();
		ctx.moveTo(0,row*cellWidth);
		ctx.lineTo(canv.width-1,row*cellWidth);
		ctx.stroke();
	}
}

function constructGrid()
{
	grid = new Array(rows);

	for(let k = 0; k < rows; k++)
	{
		grid[k] = new Array(cols);

		for(let c = 0; c < cols; c++)
		{
			grid[k][c] = 0;
		}
	}

	grid[0][0] = 1;
}

function drawBoard()
{
	for(let r = 0; r < rows; r++)
	{
		for(let c = 0; c < cols; c++)
		{
			let val = grid[r][c];

			if(val === 0)
				ctx.fillStyle = "#FFFFFF";
			else if(val === 1)
				ctx.fillStyle = "#000000";
			else
				ctx.fillStyle = "#006600";

			ctx.fillRect(c*cellWidth,r*cellWidth,cellWidth,cellWidth);
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