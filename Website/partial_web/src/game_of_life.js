// GAME OF LIFE EXAMPLE:
//--------------------------------------------------------------

function gameOfLifeInitBoard()
{
	let result = create2DArray(this.rows,this.cols);

	for(let r = 0; r < this.rows; r++)
	{
		for(let c = 0; c < this.cols; c++)
		{
			let val = Math.floor(Math.random()*2);

			let temp = new Cell(this,1,r,c);
			temp.setCurrentState(0,val);
			temp.setFutureState(0,0);
			result[r][c] = temp;
		}
	}

	this.grid = result;
}

function gameOfLifeUpdateCell(posR,posC)
{
	let count = 0;

	let grid = this.grid;
	let rows = this.rows;
	let cols = this.cols;
	let cell = grid[posR][posC];

	let up = posR - 1;
	let down = posR + 1;
	let left = posC - 1;
	let right = posC + 1;

	// COUNTING LIVE NEIGHBORS
	// upper three neighbors
	if(up >= 0 && left >= 0 && grid[up][left].state[0] == 1)
		count++;

	if(up >= 0 && grid[up][posC].state[0] == 1)
		count++;

	if(up >= 0 && right < cols && grid[up][right].state[0] == 1)
		count++;

	// middle two neighbors
	if(left >= 0 && grid[posR][left].state[0] == 1)
		count++;

	if(right < cols && grid[posR][right].state[0] == 1)
		count++;

	// bottom three neighbors
	if(down < rows && left >= 0 && grid[down][left].state[0] == 1)
		count++;

	if(down < rows && grid[down][posC].state[0] == 1)
		count++;

	if(down < rows && right < cols && grid[down][right].state[0] == 1)
		count++;


	// Updating state
	let nextState;

	if(cell.state[0] == 0)
	{
		if(count == 3)
			nextState = 1;
		else
			nextState = 0;
	}
	else
	{
		if(count < 2 || count > 3)
			nextState = 0;
		else
			nextState = 1;
	}

	// console.log("Live neighbors: " + count + "\n\n");
	cell.setFutureState(0,nextState);
}

function gameOfLifeDrawBoard()
{
	// For easier reference
	let ctx = this.context;
	let cellWidth = this.cellWidth;
	let grid = this.board.grid;

	// Draw black on the whole thing
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,this.canv.width,this.canv.height);

	// Draw all of the lives cells as white
	ctx.fillStyle = "#FFFFFF";
	for(let r = 0; r < this.board.rows; r++)
	{
		for(let c = 0; c < this.board.cols; c++)
		{
			let tempCell = grid[r][c];
			let isAlive = tempCell.state[0];

			if(isAlive == 1)
				ctx.fillRect(c*cellWidth,r*cellWidth,cellWidth,cellWidth);
		}
	}
}

function gameOfLifeUpdateCell2(posR,posC)
{
	let count = 0;

	let grid = this.grid;
	let rows = this.rows;
	let cols = this.cols;
	let cell = grid[posR][posC];

	let up = posR - 1;
	let down = posR + 1;
	let left = posC - 1;
	let right = posC + 1;

	// COUNTING LIVE NEIGHBORS
	// upper three neighbors
	if(up >= 0 && left >= 0 && grid[up][left].state[0] == 1)
		count++;

	if(up >= 0 && grid[up][posC].state[0] == 1)
		count++;

	if(up >= 0 && right < cols && grid[up][right].state[0] == 1)
		count++;

	// middle two neighbors
	if(left >= 0 && grid[posR][left].state[0] == 1)
		count++;

	if(right < cols && grid[posR][right].state[0] == 1)
		count++;

	// bottom three neighbors
	if(down < rows && left >= 0 && grid[down][left].state[0] == 1)
		count++;

	if(down < rows && grid[down][posC].state[0] == 1)
		count++;

	if(down < rows && right < cols && grid[down][right].state[0] == 1)
		count++;


	// Updating state
	let nextState;

	if(cell.state[0] == 0)
	{
		if(count == 3)
			nextState = 1;
		else
			nextState = 0;
	}
	else
	{
		if(count < 2 || count > 4)
			nextState = 0;
		else
			nextState = 1;
	}

	// console.log("Live neighbors: " + count + "\n\n");
	cell.setFutureState(0,nextState);
}

function gameOfLifeUpdateCell3(posR,posC)
{
	let count = 0;

	let grid = this.grid;
	let rows = this.rows;
	let cols = this.cols;
	let cell = grid[posR][posC];

	let up = posR - 1;
	let down = posR + 1;
	let left = posC - 1;
	let right = posC + 1;

	// COUNTING LIVE NEIGHBORS
	// upper three neighbors
	if(up >= 0 && left >= 0 && grid[up][left].state[0] == 0)
		count++;

	if(up >= 0 && grid[up][posC].state[0] == 0)
		count++;

	if(up >= 0 && right < cols && grid[up][right].state[0] == 0)
		count++;

	// middle two neighbors
	if(left >= 0 && grid[posR][left].state[0] == 0)
		count++;

	if(right < cols && grid[posR][right].state[0] == 0)
		count++;

	// bottom three neighbors
	if(down < rows && left >= 0 && grid[down][left].state[0] == 0)
		count++;

	if(down < rows && grid[down][posC].state[0] == 0)
		count++;

	if(down < rows && right < cols && grid[down][right].state[0] == 0)
		count++;


	// Updating state
	let nextState;

	if(cell.state[0] == 1)
	{
		if(count == 3)
			nextState = 0;
		else
			nextState = 1;
	}
	else
	{
		if(count < 2 || count > 3)
			nextState = 1;
		else
			nextState = 0;
	}

	// console.log("Live neighbors: " + count + "\n\n");
	cell.setFutureState(0,nextState);
}

function gameOfLifeDrawBoard2()
{
	// For easier reference
	let ctx = this.context;
	let cellWidth = this.cellWidth;
	let grid = this.board.grid;

	// Draw black on the whole thing
	ctx.fillStyle = "#0000FF";
	ctx.fillRect(0,0,this.canv.width,this.canv.height);

	// Draw all of the lives cells as white
	ctx.fillStyle = "#FFFF00";
	for(let r = 0; r < this.board.rows; r++)
	{
		for(let c = 0; c < this.board.cols; c++)
		{
			let tempCell = grid[r][c];
			let isAlive = tempCell.state[0];

			if(isAlive == 1)
				ctx.fillRect(c*cellWidth,r*cellWidth,cellWidth,cellWidth);
		}
	}
}