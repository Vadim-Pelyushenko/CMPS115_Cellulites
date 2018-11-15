// FLOWING WATER AUTOMATA. A little idea I had
// There will be a source of water near the top right side.
// A cell will have 1 value as its data. It's pressure
//--------------------------------------------------------------
// If the pressure is greater than 10000, then it is a source of water,
// and will keep producing water until it reaches 1000000, at which point it
// it turns into a cell with 0 pressure.
//
// A cell's neighborhood is the 4 adjacent cells in the cardinal directions.
//
// 0 pressure means an air cell
// If a cell is an air cell, it does nothing.
//
// When a water cell has an air cell below it, it transfers all of its pressure
// to that cell, and increases the pressure by 100 as well.
// 
// Then a cell will check all of its neighbors. It will consider the relative pressure
// of a cell below it to be -100, the relative pressure of the cell above to be +150, and
// the relative pressure of the cells to its side as being their natural pressure.
//
// Whichever of its cells has the lowest pressure, it will transfer 50% of the difference,
// (rounded down). However, if a cell has the lowest pressure of its neighbors, it does nothing.

function waterInitBoard()
{
	let result = create2DArray(this.rows,this.cols);

	for(let r = 0; r < this.rows; r++)
	{
		for(let c = 0; c < this.cols; c++)
		{
			let temp = new Cell(this,1,r,c);
			temp.setCurrentState(0,0);
			temp.setFutureState(0,0);
			result[r][c] = temp;
		}
	}

	let centerR = Math.floor(this.rows/2);
	let farCol = this.cols-1;
	
	let source = result[centerR][farCol];
	let value = 1000000 + 100*Math.floor(this.rows*this.cols/2.5);
	source.setCurrentState(0,value);
	source.setFutureState(0,value);

	this.grid = result;
}

function waterUpdateCell(posR,posC)
{
	let count = 0;

	let grid = this.grid;
	let rows = this.rows;
	let cols = this.cols;
	let cell = grid[posR][posC];
	let minPressure = cell.state[0];

	if(minPressure == 0)
		return;
	else if(minPressure == 1000000)
	{
		cell.setFutureState(0,0);
		return;
	}
	else if(minPressure > 1000000)
	{
		if(posR != rows-1)
		{
			grid[posR+1][posC].futureState[0] += 100;
			cell.futureState[0]--;
		}
		return;
	}

	let up = posR - 1;
	let down = posR + 1;
	let left = posC - 1;
	let right = posC + 1;


	let chosen = cell;

	// Figure out the minimum pressure neighbor
	let val;

	if(down < rows)
	{
		val = Math.max(grid[down][posC].state[0] - 100,0);	

		if(val < minPressure || (val == minPressure && Math.random() < 0.5 ))
		{
			minPressure = val;
			chosen = grid[down][posC];
		}
	}

	if(up >= 0)
	{
		val = grid[up][posC].state[0] + 150;	

		if(val < minPressure || (val == minPressure && Math.random() < 0.5 ))
		{
			minPressure = val;
			chosen = grid[up][posC];
		}
	}

	if(left >= 0)
	{
		val = grid[posR][left].state[0];	

		let shouldMove = right >= cols || (grid[posR][right].state[0] != 0 && val == 0) 
									   || Math.random() < 0.5;
		if(val < minPressure || (val == minPressure && shouldMove))
		{
			minPressure = val;
			chosen = grid[posR][left];
		}
	}

	if(right < cols)
	{
		val = grid[posR][right].state[0];	

		let shouldMove = left < 0 || (grid[posR][left].state[0] != 0 && val == 0) 
									   || Math.random() < 0.5;

		if(val < minPressure || (val == minPressure && shouldMove))
		{
			minPressure = val;
			chosen = grid[posR][right];
		}
	}

	if(minPressure == cell.state[0])
		return;

	let transfer;
	if(chosen.state[0] == 0 && chosen.futureState[0] == 0)
		transfer = cell.state[0];
	else
		transfer = Math.floor((cell.state[0] - Math.max(0,minPressure))/2);

	chosen.futureState[0] += transfer;
	cell.futureState[0] -= transfer;
}

function waterDrawBoard()
{
	// For easier reference
	let ctx = this.context;
	let cellWidth = this.cellWidth;
	let grid = this.board.grid;

	// Draw white on the whole thing
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,this.canv.width,this.canv.height);

	// Draw all of the lives cells as white
	ctx.fillStyle = "#ADD8E6";
	for(let r = 0; r < this.board.rows; r++)
	{
		for(let c = 0; c < this.board.cols; c++)
		{
			let tempCell = grid[r][c];
			let pressure = tempCell.state[0];

			if(pressure >= 1000000)
			{
				ctx.fillStyle = "#00FF00";
				ctx.fillRect(c*cellWidth,r*cellWidth,cellWidth,cellWidth);
				ctx.fillStyle = "#ADD8E6";
			}
			else if(pressure > 0)
				ctx.fillRect(c*cellWidth,r*cellWidth,cellWidth,cellWidth);
		}
	}
}