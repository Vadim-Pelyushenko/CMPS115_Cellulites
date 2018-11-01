class Board
{
	constructor(rows, cols)
	{
		this.rows = rows;
		this.cols = cols;

		this.initBoard();
	}

	// Initializes the board for John Conway's Game of Life
	initBoard()
	{
		this.grid = create2DArray(this.rows,this.cols);
		this.liveCount = create2DArray(this.rows,this.cols);

		for(let r = 0; r < this.rows; r++)
		{
			for(let c = 0; c < this.cols; c++)
			{
				this.grid[r][c] = Math.floor(Math.random()*2);
			}
		}
	}	

	// Updates the board for John Conway's Game of Life
	updateBoard()
	{
		// Count how many cells are alive around each cell
		for(let r = 0; r < this.rows; r++)
		{
			for(let c = 0; c < this.cols; c++)
			{
				this.liveCount[r][c] = this.liveNeighbors(r,c);
			}
		}

		// Update all the cells based on their live neighbors
		for(let r = 0; r < this.rows; r++)
		{
			for(let c = 0; c < this.cols; c++)
			{
				let liveNeigh = this.liveCount[r][c];

				if(this.grid[r][c] == 0)
				{
					if(liveNeigh == 3)
						this.grid[r][c] = 1;
				}
				else
				{
					if(liveNeigh < 2 || liveNeigh > 3)
						this.grid[r][c] = 0;
				}
			}
		}
	}

	// Cells in John Conway's Game of Life evolve based on the number of neighbors
	// that are alive around a cell
	liveNeighbors(r, c)
	{
		let count = 0;

		count += this.liveVal(r+1,c-1);
		count += this.liveVal(r+1,c);
		count += this.liveVal(r+1,c+1);

		count += this.liveVal(r,c-1);
		count += this.liveVal(r,c+1);

		count += this.liveVal(r-1,c-1);
		count += this.liveVal(r-1,c);
		count += this.liveVal(r-1,c+1);

		return count;
	}

	// Returns 0 if this cell is out of bounds, or isn't alive
	// returns 1 otherwise.
	// Allows easy counting of live neighbors.
	liveVal(r, c)
	{
		if(!this.inBounds(r,c) || this.grid[r][c] == 0)
			return 0;
		else
			return 1;
	}

	inBounds(r, c)
	{
		return r >= 0 && c >= 0 && r < this.rows && c < this.cols;
	}
}

function create2DArray(rows, cols)
{
	let result = new Array(rows);

	for(let r = 0; r < rows; r++)
	{
		result[r] = new Array(cols);
	}

	return result;
}

// For Debugging
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