var rows;
var cols;
var cellWidth;
var gridColor;

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

	makeGrid();
}

function handleClick(evt)
{
	let mousePos = getMousePos(canv,evt);
	console.log("Coordinates: " + mousePos.x + ", " + mousePos.y);
	let col = Math.floor(mousePos.x / cellWidth);
	let row = Math.floor(mousePos.y / cellWidth);
	console.log("Row: " + row + ", Col: " + col);
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

function makeGrid()
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