let grid;

let rows = 100;
let cols = 100;

let cellWidth = 5;

let width = rows*cellWidth;
let height = cols*cellWidth;

let context;
let frame = 0;


function create2DArray(rows, cols)
{
	let result = new Array(rows);

	for(let r = 0; r < result.length; r++)
	{
		result[r] = new Array(cols);
	}

	return result;
}

function initBoard(grid)
{
	for(let r = 0; r < rows; r++)
	{
		for(let c = 0; c < rows; c++)
		{
			grid[r][c] = Math.floor(Math.random()*2);
		}
	}
}

function updateBoard()
{
	let liveNeighbors = create2DArray(rows,cols);
	
	for(let r = 0; r < rows; r++)
	{
		for(let c = 0; c < cols; c++)
		{
			liveNeighbors[r][c] = countLive(r,c);
		}
	}

	for(let r = 0; r < rows; r++)
	{
		for(let c = 0; c < cols; c++)
		{
			let neigh = liveNeighbors[r][c];
			if(grid[r][c] == 0)
			{
				if(neigh == 3)
					grid[r][c] = 1;
			}
			else
			{
				if(neigh < 2 || neigh > 3)
					grid[r][c] = 0;
			}
		}
	}
}

function printBoard()
{
	console.log("The board:");
	for(let r = 0; r < rows; r++)
	{
		let result = "";
		for(let c = 0; c < cols; c++)
		{
			result += grid[r][c] + " ";
		}
		console.log(result);
	}
}

function countLive(row, col)
{
	// console.log(row + " " + col);
	let count = 0;

	let atTop = (row == 0);
	let atBottom = (row == rows - 1);
	let atLeft = (col == 0);
	let atRight = (col == cols - 1);

	if(!atTop)
	{
		if(!atLeft && grid[row-1][col-1] == 1)
			count++;

		if(grid[row-1][col] == 1)
			count++;

		if(!atRight && grid[row-1][col+1] == 1)
			count++;
	}

	if(!atLeft && grid[row][col-1] == 1)
		count++;

	if(!atRight && grid[row][col+1] == 1)
		count++;

	if(!atBottom)
	{
		if(!atLeft && grid[row+1][col-1] == 1)
			count++;

		// console.log("\t" + (row+1) + " " + (col));
		// console.log();
		if(grid[row+1][col] == 1)
			count++;

		if(!atRight && grid[row+1][col+1] == 1)
			count++;
	}

	return count;
}

function start()
{
	console.log("Script has begun");
	grid = create2DArray(rows,cols);
	initBoard(grid);

	let canvas = document.createElement("canvas");
	canvas.width = rows*cellWidth;
	canvas.height = rows*cellWidth;

	context = canvas.getContext("2d");
	document.body.insertBefore(canvas,document.body.childNodes[0]);

	setInterval(cycle,17);
}

function drawBoard()
{
	context.fillStyle = "#000000";
	context.fillRect(0,0,400,400);
	context.fillStyle = "#FFFFFF";
	for(let r = 0; r < rows; r++)
	{
		for(let c = 0; c < cols; c++)
		{
			if(grid[r][c] == 1)
				context.fillRect(r*cellWidth,c*cellWidth,cellWidth,cellWidth);
		}
	}
}

function cycle(context)
{
	console.log("current Frame: " + frame);
	printBoard();

	frame++;
	drawBoard();
	updateBoard();
}
